import { Request, Response } from 'express'
import { getUser, getUsers, updateUser, deleteUser as deleteUserService } from '../services/users.service'

const getAll = async (req: Request, res: Response) => {
    try {
        const usersRes = await getUsers()
        if (!usersRes.ok) {
            return res.status(404).send({ error: 'Users not found' })
        }
        const users = usersRes.data
        res.send(users)
    } catch (e: any) {
        console.log(e.message)
        res.status(500).send({ error: 'server error' })
    }
}

const getSelf = (req: Request, res: Response) => {
    res.send(req.user)
}

const getOne = async (req: Request, res: Response) => {
    const resUser = await getUser(req.params.id)
    if (!resUser.ok) {
        return res.status(404).send({ error: 'User not found' })
    }
    return res.send(resUser.data)
}

const updateSelf = async (req: Request, res: Response) => {
    if (!req?.user) {
        return res.status(404).send({ error: 'User not found' })
    }
    req.body.id = undefined
    req.body.role = undefined
    req.body.coin_balance = undefined
    const resUpdatedUser = await updateUser(req.user.id, req.body)
    if (!resUpdatedUser.ok) {
        return res.status(409).send({error: 'Can\'t upodate user', message_code_string: 'user_not_updated'})
    }
    return res.send(resUpdatedUser.data)
}

const updateUserController = async (req: Request, res: Response) => {
    if (!req?.user) {
        return res.status(404).send({ error: 'User not found' })
    }
    if (req.user.role !== 'ADMIN') {
        return res.status(403).send({ error: 'Forbidden' })
    }
    req.body.id = undefined
    const resUpdatedUser = await updateUser(req.params.id, req.body)
    if (!resUpdatedUser.ok) {
        return res.status(409).send({ error: 'Can\'t upodate user', message_code_string: 'user_not_updated' })
    }
    return res.send(resUpdatedUser.data)
}

const deleteUser = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(404).json({ error: 'User not found' })
    }
    const { user } = req
    const resDeleteUser = await deleteUserService(user.id)
    if (!resDeleteUser.ok) {
        return res.status(400).json({ error: 'Bad request' })
    }
    return res.status(200).json({ message: 'User deleted' })
}

const substractBalance = async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(404).json({ message: 'User not found' })
    }
    const { user } = req
    if (!req.query?.amount || Number(user.coin_balance) < Number(req.query.amount)) {
        return res.status(400).json({ message: 'Bad request. Not enough balance' })
    }
    const resUpdateUser = await updateUser(user.id, { coin_balance: Number(user.coin_balance) - Number(req.query.amount) })
    if (!resUpdateUser.ok) {
        return res.status(400).json({ message: 'Bad request. Not enough balance' })
    }
    return res.status(200).json({ message: 'Balance substracted', user: resUpdateUser.data })
}

export { getAll, getOne, deleteUser, getSelf, substractBalance, updateSelf, updateUserController }