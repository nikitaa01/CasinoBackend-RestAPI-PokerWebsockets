import { Request, Response } from 'express';
import { generateToken, verifyToken } from '../utils/jwt';
import { updateUser, getUserByEmail } from '../services/users.service';

const getCode = (req: Request, res: Response) => {
    if (!req.query?.email || !req.query?.amount) {
        return res.sendStatus(400)
    }
    const code = generateToken('checkout', { email: req.query.email, amount: req.query.amount })
    res.send({ code })
}

const confirmPayment = async (req: Request, res: Response) => {
    if (!req.query?.code) {
        return res.status(400).redirect(process.env.ROOT_URI as string)
    }

    const code = req.query.code as string
    const data = verifyToken(code) as { id: string, email: string, amount: number }
    if (!data || data.id != 'checkout') {
        return res.status(400).redirect(process.env.ROOT_URI as string)
    }
    const resFindedUser = await getUserByEmail(false, data.email)
    if (!resFindedUser.ok) {
        return res.status(400).redirect(process.env.ROOT_URI as string)
    }
    const resUpdateUser = await updateUser(resFindedUser.data.id, { coin_balance: Number(resFindedUser.data.coin_balance) + Number(data.amount) })
    if (!resUpdateUser.ok) {
        return res.status(400).redirect(process.env.ROOT_URI as string)
    }
    return res.redirect(`${process.env.ROOT_URI}/profile/${resFindedUser.data.id}`)
}

export { getCode, confirmPayment }