import { Request, Response, NextFunction } from 'express'
import { verify as jwtVerify } from 'jsonwebtoken'
import { getUser } from '../services/users.service'

const checkToken = async (req: Request) => {
    const token = req.headers.authorization?.split(' ')[1]
    return token
}

const authByToken = (strict = true) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = await checkToken(req)
        if (!token && strict) 
            return res.status(401).json({ message: 'No token provided' })
        if (!token)
            return next()
        try {
            const decoded = jwtVerify(token, process.env.SECRET as string) as { id: string } | undefined
            if (!decoded?.id) {
                return res.status(401).json({ message: 'Unauthorized' })
            }
            const user = await getUser(Number(decoded.id))
            if (!user)
                return res.status(404).json({ message: 'User not found' })
            req.user = user
            next()
        } catch (error) {
            return res.status(500).json({ message: 'Server error' })
        }
    }
}

const authBySecret = async (req: Request, res: Response, next: NextFunction) => {
    const token = await checkToken(req)
    if (!token)
        return res.status(401).json({ message: 'No token provided' })
    try {
        if (token !== process.env.SECRET)
            return res.status(401).json({ message: 'Unauthorized' })
        const user = await getUser(Number(req.params.id))
        if (!user)
            return res.status(404).json({ message: 'User not found' })
        req.user = user
        next()
    } catch (error) {
        return res.status(500).json({ message: 'Server error' + error })
    }
}

export { authByToken, authBySecret }