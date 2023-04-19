import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import User from '../interfaces/user.interface'
import { getUser } from '../services/users.service'
import { updateUser } from '../services/users.service'
import { Decimal } from '@prisma/client/runtime/binary'

const getAll = async (req: Request, res: Response) => {
    if (req.user) {
        return res.send(req.user)
    }
    const prisma = new PrismaClient()
    try {
        const users: User[] = await prisma.users.findMany({})
        res.send(users)
    } catch (e: any) {
        console.log(e.message)
        res.status(500).send({ error: 'server error' })
    }
}

const getOne = async (req: Request, res: Response) => {
    const resUser = await getUser(req.params.id)
    if (!resUser.ok) {
        return res.status(404).send({ error: 'User not found' })
    }
    return res.send(resUser.data)
}

const substractBalance = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const { user } = req
    if (user.coin_balance.toNumber() < +req.params.amount) {
        return res.status(400).json({ message: 'Bad request. Not enough balance' })
    }
    const resUpdateUser = await updateUser(user.id, { coin_balance: new Decimal(user.coin_balance.toNumber() - req.body.amount) })
    if (!resUpdateUser.ok) {
        return res.status(400).json({ message: 'Bad request. Not enough balance' })
    }
    return res.status(200).json({ message: 'Balance substracted', user: resUpdateUser.data })
}

export { getAll, getOne, substractBalance }