import { PrismaClient } from "@prisma/client"
import IUser from "../interfaces/user.interface"
import { uuid } from "uuidv4"
import { hash } from "bcrypt"
import UserResponse from "../types/userResponse.type"

const create = async (user: IUser): UserResponse => {
    try {
        const prisma = new PrismaClient()
        user.id = uuid()
        user.password = await hash(user.password, 10)
        user.avatar_url = `/api/users/avatar/${user.id}}`
        const newUser = await prisma.users.create({
            data: user
        })
        return { ok: true, user: newUser }
    } catch (e) {
        console.log(e)
        return { ok: false }
    }
}

const getUserTemplate = async (query: object): UserResponse => {
    try {
        const prisma = new PrismaClient()
        const response = await prisma.users.findUnique({
            where: query
        })
        if (!response) {
            return { ok: false }
        }
        const user: IUser = response
        return { ok: true, user }
    } catch (error) {
        console.log(error)
        return { ok: false }
    }
}

const getUser = async (idQuery: string) => {
    return await getUserTemplate({ id: idQuery })
}

const getUserByEmail = async (emailQuery: string) => {
    return await getUserTemplate({ email: emailQuery })
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
        const user: IUser = response
        return { ok: true, user }
    } catch (error) {
        console.log(error)
        return { ok: false }
    }
}

export { create, getUser, getUserByEmail, updateUser }