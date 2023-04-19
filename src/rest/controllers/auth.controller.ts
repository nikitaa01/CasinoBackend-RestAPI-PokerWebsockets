import { Request, Response } from "express";
import { getGoogleAuthURL, getGoogleToken, getGoogleProfile } from "../services/auth.service";
import { create, getUserByOauth, updatePassword } from "../services/users.service";
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
        return res.status(400).json({ message: 'Can\'t generate token' })
    }
    const token = resToken.data;
    const resProfile = await getGoogleProfile(token.access_token, token.id_token);
    if (!resProfile.ok) {
        return res.status(400).json({ message: 'Can\'t get profile' })
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
            return res.status(400).json({ message: 'Can\'t create user' })
        }
        req.session.token = generateToken(resCreatedUser.data.id)
        return res.status(200).json({ message: 'User created' })
    }
    req.session.token = generateToken(resFindedUser.data.id)
    return res.status(200).json({ message: 'User found' })
}

const register = async (req: Request, res: Response) => {
    const resFindedUser = await create(req.body)
    if (!resFindedUser.ok) {
        return res.status(401).send({ error: 'User not created' })
    }
    return res.status(201).send(resFindedUser.data)
}

const login = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const token = generateToken(req.user.id)
    req.session.token = token
    res.json({ message: 'User found', user: req.user, token })
}

// FIXME: arreglar que siempre sale 400
const sendResetPassword = async ({ body }: any, res: Response) => {
    console.log(body)
    const { email } = body
    const jwt = generateToken(email, { resetPassword: true })
    const url = new URL(`${process.env.SERVER_ROOT_URI}/api/auth/reset-password/callback` ?? '')
    url.searchParams.append('code', jwt)
    const mail = await sendResetMail(email, url.toString())
    res.sendStatus(mail ? 200 : 400)
}

// FIXME: replantear la funcion callbackResetPassword
const callbackResetPassword = async (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html')
    res.send(`
    <div style="width: '100%'">
        <h1>Reset password</h1>
        <h1 id="jwt" style="overflow-wrap: anywhere;"></h1>
    </div>
    <script>
        const query = window.location.search
        const jwt = new URLSearchParams(query).get('code')
        document.getElementById('jwt').innerHTML = jwt
    </script>
    `)
}

const confirmResetPassword = async ({ body }: any, res: Response) => {
    const data = verifyToken(body.jwt) as { id: string, resetPassword: boolean }
    if (!data.resetPassword) {
        return res.sendStatus(400)
    }
    console.log(data)
    const resUpdateUser = await updatePassword(data.id, body.password)
    if (!resUpdateUser.ok) {
        return res.sendStatus(400)
    }
    res.sendStatus(200)
}

export { redirectToGoogleAuth, googleCallback, register, login, sendResetPassword, callbackResetPassword, confirmResetPassword }
