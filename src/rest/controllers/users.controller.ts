import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import User from '../interfaces/user.interface'
import { findImagePathByName } from '../services/files.service'
import { create, getUser } from '../services/users.service'
import { updateUser } from '../services/users.service'
import { Decimal } from '@prisma/client/runtime/binary'
import util from 'util'
import https from 'https'
import { Session } from 'express-session'

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
    const user = await getUser(req.params.id)
    if (!user.ok) {
        return res.status(404).send({ error: 'User not found' })
    }
    return res.send(user.user)
}

const register = async (req: Request, res: Response) => {
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
    req.session.token = token
    res.json({ token })
}

const getSvgImage = util.promisify((fileName: string, callback: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const url = `https://api.dicebear.com/6.x/identicon/svg?seed=${fileName}`;
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            callback(null, data);
        });
    }).on('error', (err) => {
        callback(err);
    });
});

const getAvatar = async (req: Request, res: Response) => {
    const fileName = req.params.id
    if (!fileName) {
        return res.status(404).send({ message: 'Avatar Not found' })
    }
    const routeImg = findImagePathByName(fileName)
    if (routeImg) {
        return res.sendFile(routeImg)
    }
    const svgImage = await getSvgImage(fileName);
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(svgImage);
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
    return res.status(200).json({ message: 'Balance substracted', user: resUpdateUser.user })
}

export { getAll, getOne, login, getAvatar, register, substractBalance }