import { Request, Response, NextFunction } from 'express'
import { verify as jwtVerify } from 'jsonwebtoken'
import { getUser, getUserByEmail } from '../services/users.service'
import { UserPrivate } from '../interfaces/user.interface'
import bcript from 'bcrypt'

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
            req.user = resFindedUser.data as UserPrivate
            next()
        } catch (error) {
            return res.status(500).json({ message: 'Server error' })
        }
    }
}

const authByCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
        const resFindedUser = await getUserByEmail(true, email)
        if (!resFindedUser.ok) {
            return res.status(404).json({ message: 'User not found' })
        }
        req.user = resFindedUser.data as UserPrivate
        if (!await bcript.compare(password, req.user.password)) {
            return res.status(401).json({ message: 'Unauthorized. Wrong password' })
        }
        next()
    } catch (error) {
        return res.status(500).json({ message: 'Server error' })
    }
}

export { authBySession, authByCredentials }