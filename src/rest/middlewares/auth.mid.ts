import { Request, Response, NextFunction } from 'express'
import { verify as jwtVerify } from 'jsonwebtoken'
import { getUser, getUserByEmail } from '../services/users.service'
import { UserPrivate } from '../interfaces/user.interface'
import bcript from 'bcrypt'

const findUser = async (token: string, req: Request, res: Response, next: NextFunction) => {
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

const auth = (strict = true) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.session.token
        if (!token && strict) {
            if (req.headers.authorization) {
                const authHeader = req.headers.authorization
                const token = authHeader.split(' ')[1]
                return findUser(token, req, res, next)
            }
            return res.status(401).json({ message: 'Unauthorized. No token provided' })
        }
        if (!token)
            return next()
        return findUser(token, req, res, next)
    }
}

const authByCredentials = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    try {
        const resFindedUser = await getUserByEmail(true, email)
        if (!resFindedUser.ok) {
            return res.status(404).json({ message: 'User not found', field: 'email', message_code_string: 'user_not_found' })
        }
        req.user = resFindedUser.data as UserPrivate
        if (!await bcript.compare(password, req.user.password)) {
            return res.status(401).json({ message: 'Unauthorized. Wrong password', field: 'password', message_code_string: 'wrong_password' })
        }
        next()
    } catch (error) {
        return res.status(500).json({ message: 'Server error' })
    }
}

export { auth, authByCredentials }