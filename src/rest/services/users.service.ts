import { PrismaClient } from "@prisma/client"
import User, { UserPrivate } from "../interfaces/user.interface"
import { uuid } from "uuidv4"
import { hash } from "bcrypt"
import UserResponse from "../types/userResponse.type"

const create = async (user: UserPrivate): UserResponse => {
    try {
        const prisma = new PrismaClient()
        user.id = uuid()
        user.password = await hash(user.password, 10)
        user.avatar_url = user.avatar_url ?? `/api/users/avatar/${user.id}}`
        const newUser = await prisma.users.create({
            data: user
        })
        return { ok: true, user: newUser }
    } catch (e) {
        console.log(e)
        return { ok: false }
    }
}

const getUserTemplate = async (password: boolean, query: object): UserResponse => {
    try {
        const prisma = new PrismaClient()
        const response = await prisma.users.findUnique({
            where: query,
            select: {
                id: true,
                email: true,
                coin_balance: true,
                first_name: true,
                last_name: true,
                avatar_url: true,
                oauth_provider: true,
                oauth_provider_id: true,
                created_at: true,
                updated_at: true,
                password
            },
        })
        if (!response) {
            return { ok: false }
        }
        const user = password ? response as UserPrivate : response as User
        return { ok: true, user }
    } catch (error) {
        console.log(error)
        return { ok: false }
    }
}

const getUser = async (idQuery: string) => {
    return await getUserTemplate(false, { id: idQuery })
}

const getUserByEmail = async (password: boolean, emailQuery: string) => {
    return await getUserTemplate(password, { email: emailQuery })
}

const getUserByOauth = async (oauthQuery: string) => {
    return await getUserTemplate(false, { oauth_provider_id: oauthQuery })
}

const updateUser = async (id: string, data: object): UserResponse => {
    try {
        const prisma = new PrismaClient()
        const response = await prisma.users.update({
            where: { id },
            data
        })
        if (!response) {
            return { ok: false }
        }
        const user: User = response
        return { ok: true, user }
    } catch (error) {
        console.log(error)
        return { ok: false }
    }
}

export { create, getUser, getUserByEmail, updateUser, getUserByOauth }