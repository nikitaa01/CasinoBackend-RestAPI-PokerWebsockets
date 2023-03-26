import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import IUser from '../interfaces/user.interface'
import { findImagePathByName } from '../services/files.service'
import { create } from '../services/users.service'
import { getUser, updateUser } from '../services/users.service'
import { Decimal } from '@prisma/client/runtime/binary'

const getAll = async (_req: Request, res: Response) => {
    const prisma = new PrismaClient()
    try {
        const users: IUser[] = await prisma.users.findMany({})
        res.send(users)
    } catch (e: any) {
        console.log(e.message)
        res.status(500).send({ error: 'server error' })
    }
}

const register = async (req: Request, res: Response) => {
    console.log(req.body)
    const resFindedUser = await create(req.body)
    if (!resFindedUser.ok) {
        return res.status(401).send({ error: 'User not created' })
    }
    return res.status(201).send(resFindedUser.user)
}

const login = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const token = sign({ id: req.user.id }, process.env.SECRET as string, {
        expiresIn: 86400, // 24 hours
    })
    res.json({ token })
}

const getAvatar = (req: Request, res: Response) => {
    const fileName = req.params.id || req.user?.id
    if (!fileName) {
        return res.status(404).send({ message: 'Not found' })
    }
    const routeImg = findImagePathByName(fileName)
    res.sendFile(routeImg)
}

const substractBalance = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const resFindedUser = await getUser(req.user.id)
    if (!resFindedUser.ok) {
        return res.status(404).json({ message: 'User not found' })
    }
    const { user } = resFindedUser
    if (user.coin_balance.toNumber() < +req.params.amount) {
        return res.status(400).json({ message: 'Bad request. Not enough balance' })
    }
    const resUpdateUser = await updateUser(req.user.id, { coin_balance: new Decimal(user.coin_balance.toNumber() - req.body.amount) })
    if (!resUpdateUser.ok) {
        return res.status(400).json({ message: 'Bad request. Not enough balance' })
    }
    return res.status(200).json({ message: 'Balance substracted', user: resUpdateUser.user })
}

export { getAll, login, getAvatar, register }