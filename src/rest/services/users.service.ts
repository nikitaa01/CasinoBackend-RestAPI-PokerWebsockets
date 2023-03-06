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

const getUser = async (idQuery: number) => {
    const prisma = new PrismaClient()
    const response = await prisma.users.findUnique({
        include: {
            user_extended: true
        },
        where: {
            id: idQuery
        }
    })
    if (!response) {
        return
    }
    const user: IUser = prismaToIUserParser(response)
    return user
}

const getUserByEmail = async (emailQuery: string) => {
    const prisma = new PrismaClient()
    const response = await prisma.users.findUnique({
        include: {
            user_extended: true
        },
        where: {
            email: emailQuery
        }
    })
    if (!response) {
        return
    }
    const user: IUser = prismaToIUserParser(response)
    return user
}

export { create, getUser, getUserByEmail }