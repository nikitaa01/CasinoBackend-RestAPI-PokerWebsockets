import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import UserReq from '../interfaces/userReq.interface'
import { PrismaClient } from '@prisma/client'
import prismaToIUserParser from '../utils/prismaToIUserParser'
import IUser from '../interfaces/user.interface'
import { findImagePathByName } from '../services/files.service'

const getAll = async (_req: Request, res: Response) => {
    const prisma = new PrismaClient()
    try {
        const users: IUser[] = (await prisma.users.findMany({
            include: {
                user_extended: true
            }
        }))
            .map(user => prismaToIUserParser(user))
        res.send(users)
    } catch (e: any) {
        console.log(e.message)
        res.status(500).send({ error: 'server error' })
    }
}

const login = async (req: UserReq, res: Response) => {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const token = sign({ id: req.user.id }, process.env.SECRET as string, {
        expiresIn: 86400, // 24 hours
    })
    res.json({ token })
}

const getAvatar = (req: Request, res: Response) => {
    const fileName = req.params.id || String(req.user?.id)
    if (!fileName) {
        return res.status(404).send({ message: 'Not found' })
    }
    const routeImg = findImagePathByName(fileName)
    res.sendFile(routeImg)
}

export { getAll, login, getAvatar }