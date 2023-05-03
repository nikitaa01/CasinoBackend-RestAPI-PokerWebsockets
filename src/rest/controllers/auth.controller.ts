import { Request, Response } from "express";
import { getGoogleAuthURL, getGoogleToken, getGoogleProfile } from "../services/auth.service";
import { create, getUserByEmail, getUserByOauth, updatePassword } from "../services/users.service";
import { UserPrivate } from "../interfaces/user.interface";
import { generateToken } from "../utils/jwt";
import { sendResetMail } from "../services/mail.service";
import { verifyToken } from "../utils/jwt";

const redirectToGoogleAuth = (_req: Request, res: Response) => {
    res.redirect(getGoogleAuthURL());
}

const googleCallback = async (req: Request, res: Response) => {
    const resToken = await getGoogleToken(req.query.code as string);
    if (!resToken.ok) {
        return res.status(400).redirect(`${process.env.ROOT_URI}/login`)
    }
    const token = resToken.data;
    const resProfile = await getGoogleProfile(token.access_token, token.id_token);
    if (!resProfile.ok) {
        return res.status(400).redirect(`${process.env.ROOT_URI}/login`)
    }
    const profile = resProfile.data;
    const resFindedUser = await getUserByOauth(profile.id)
    if (!resFindedUser.ok) {
        const resCreatedUser = await create({
            first_name: profile.given_name,
            last_name: profile.family_name,
            email: profile.email,
            password: profile.id,
            avatar_url: profile.picture,
            oauth_provider: "google",
            oauth_provider_id: profile.id,
        } as UserPrivate)
        if (!resCreatedUser.ok) {
            return res.status(400).redirect(`${process.env.ROOT_URI}/login`)
        }
        req.session.token = generateToken(resCreatedUser.data.id)
        return res.redirect(`${process.env.ROOT_URI}`)
    }
    req.session.token = generateToken(resFindedUser.data.id)
    return res.redirect(`${process.env.ROOT_URI}`)
}

const register = async (req: Request, res: Response) => {
    if (req.body.role == 'ADMIN' && req.user?.role != 'ADMIN') {
        return res.status(403).send({ error: "Only admin users can create admin users" })
    }
    const resFindedUser = await getUserByEmail(false, req.body.email)
    if (resFindedUser.ok) {
        return res.status(409).send({ error: 'User already exists', message_code_string: 'user_already_exists' })
    }
    const resCreatedUser = await create(req.body)
    if (!resCreatedUser.ok) {
        return res.status(401).send({ error: 'User not created' })
    }
    const token = generateToken(resCreatedUser.data.id)
    req.session.token = token
    return res.status(201).send(resCreatedUser.data)
}

const login = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(404).send({ message_code_string: 'user_not_found' })
    }
    const token = generateToken(req.user.id)
    if (req.query.jwt === 'true') {
        return res.send({ token })
    }
    req.session.token = token
    res.send({ message_code_string: 'user_fetched', user: req.user })
}

const logout = async (req: Request, res: Response) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(400).send({ message_code_string: 'logout_error' })
        }
        res.clearCookie('express.session.id')
        res.send({ message_code_string: 'logout_success' })
    })
}

// FIXME: arreglar que siempre sale 400
const sendResetPassword = async ({ body }: any, res: Response) => {
    console.log(body)
    const { email } = body
    const jwt = generateToken(email, { resetPassword: true })
    const url = new URL(`${process.env.ROOT_URI}/forgot-password/callback` ?? '')
    url.searchParams.append('code', jwt)
    const mail = await sendResetMail(email, url.toString())
    res.status(mail ? 200 : 400).send({ ok: mail })
}

const confirmResetPassword = async ({ body, session }: any, res: Response) => {
    if (!body.code || !body.password) {
        return res.sendStatus(400)
    }
    const data = verifyToken(body.code) as { id: string, resetPassword: boolean }
    if (!data.resetPassword) {
        return res.sendStatus(400)
    }
    const resUpdateUser = await updatePassword(data.id, body.password)
    if (!resUpdateUser.ok) {
        return res.sendStatus(400)
    }
    const resFindedUser = await getUserByEmail(false, data.id)
    if (!resFindedUser.ok) {
        return res.sendStatus(400)
    }
    const token = generateToken(resFindedUser.data.id)
    session.token = token
    res.sendStatus(200)
}

export { redirectToGoogleAuth, googleCallback, register, login, logout, sendResetPassword, confirmResetPassword }
