import { PrismaClient } from "@prisma/client"
import IUser from "../interfaces/user.interface"
import prismaToIUserParser from "../utils/prismaToIUserParser"

const create = async (user: IUser) => {
    const prisma = new PrismaClient()
    const newUser = await prisma.users.create({
        data: user
    })
    return newUser
}

const getUserTemplate = async (query: object) => {
    const prisma = new PrismaClient()
    const response = await prisma.users.findUnique({
        include: {
            user_extended: true
        },
        where: query
    })
    if (!response) {
        return
    }
    const user: IUser = prismaToIUserParser(response)
    return user
}

const getUser = async (idQuery: number) => {
    return await getUserTemplate({ id: idQuery })
}

const getUserByEmail = async (emailQuery: string) => {
    return await getUserTemplate({ email: emailQuery })
}

export { create, getUser, getUserByEmail }