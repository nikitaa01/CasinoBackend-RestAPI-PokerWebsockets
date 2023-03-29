import { Request, Response, NextFunction } from 'express'
import { verify as jwtVerify } from 'jsonwebtoken'
import { getUser, getUserByEmail } from '../services/users.service'
import { compare } from 'bcrypt'
import { UserPrivate } from '../interfaces/user.interface'

const checkToken = (req: Request) => {
    const token = req.headers.authorization?.split(' ')[1]
    return token
}

const authByToken = (strict = true) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = checkToken(req)
        if (!token && strict)
            return res.status(401).json({ message: 'Unauthorized. No token provided' })
        if (!token)
            return next()
        try {
            const decoded = jwtVerify(token, process.env.SECRET as string) as { id: string } | undefined
            if (!decoded?.id) {
                return res.status(401).json({ message: 'Unauthorized. No user attached to that token' })
            }
            const resFindedUser = await getUser(decoded.id)
            if (!resFindedUser.ok) {
                return res.status(404).json({ message: 'User not found' })
            }
            req.user = resFindedUser.user
            next()
        } catch (error) {
            return res.status(500).json({ message: 'Server error' })
        }
    }
}

const authBySession = (strict = true) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.session.token
        if (!token && strict)
            return res.status(401).json({ message: 'Unauthorized. No token provided' })
        if (!token)
            return next()
        try {
            const decoded = jwtVerify(token, process.env.SECRET as string) as { id: string } | undefined
            if (!decoded?.id) {
                return res.status(401).json({ message: 'Unauthorized. No user attached to that token' })
            }
            const resFindedUser = await getUser(decoded.id)
            if (!resFindedUser.ok) {
                return res.status(404).json({ message: 'User not found' })
            }
            req.user = resFindedUser.user
            next()
        } catch (error) {
            return res.status(500).json({ message: 'Server error' })
        }
    }
}

const authByPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findedUser = await getUserByEmail(true, req.body.email)
        if (!findedUser.ok) {
            return res.status(404).json({ message: `User not found. No user with email: ${req.body.email}` })
        }
        const user = findedUser.user as UserPrivate
        if (!compare(req.body.password, user.password)) {
            return res.status(401).json({ message: 'Unauthorized. Password doesn\'t match' })
        }
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({ message: 'Server error' + error })
    }
}

export { authByToken, authBySession, authByPassword }