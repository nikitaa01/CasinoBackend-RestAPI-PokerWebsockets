import { PrismaClient } from "@prisma/client"
import User, { UserPrivate } from "../interfaces/user.interface"
import { uuid } from "uuidv4"
import { hash } from "bcrypt"
import Response from "../types/response.type"

const create = async (user: UserPrivate): Response<User> => {
    try {
        const prisma = new PrismaClient()
        user.id = uuid()
        user.password = await hash(user.password, 10)
        user.avatar_url = user.avatar_url ?? `/api/users/avatar/${user.id}}`
        const newUser = await prisma.users.create({
            data: user
        })
        return { ok: true, data: newUser }
    } catch (e) {
        console.log(e)
        return { ok: false }
    }
}

const getUserTemplate = async (password: boolean, query: object): Response<User | UserPrivate> => {
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
        const data = password ? response as UserPrivate : response as User
        return { ok: true, data }
    } catch (error) {
        console.log(error)
        return { ok: false }
    }
}

const getUser = async (idQuery: string): Response<User> => {
    const resUser = await getUserTemplate(false, { id: idQuery })
    if (resUser.ok) {
        resUser.data = { password: undefined, ...resUser.data } as User
    }
    return resUser
}

const getUserByEmail = async (password: boolean, emailQuery: string) => {
    const resUser = await getUserTemplate(password, { email: emailQuery })
    return resUser
}

const getUserByOauth = async (oauthQuery: string) => {
    const resUser = await getUserTemplate(false, { oauth_provider_id: oauthQuery })
    if (resUser.ok) {
        resUser.data = { password: undefined, ...resUser.data } as User
    }
    return resUser
}

const updateUser = async (id: string, dataToUpdate: object): Response<User> => {
    try {
        const prisma = new PrismaClient()
        const response = await prisma.users.update({
            where: { id },
            data: dataToUpdate,
        })
        if (!response) {
            return { ok: false }
        }
        const data: User = response
        return { ok: true, data }
    } catch (error) {
        console.log(error)
        return { ok: false }
    }
}

const updatePassword = async (email: string, password: string): Response<null> => {
    try {
        const prisma = new PrismaClient()
        const response = await prisma.users.update({
            where: { email },
            data: { password: await hash(password, 10) },
        })
        if (!response) {
            return { ok: false }
        }
        return { ok: true, data: null }
    } catch (error) {
        console.log(error)
        return { ok: false }
    }
}

export { create, getUser, getUserByEmail, updateUser, getUserByOauth, updatePassword }