import { user_extended, users } from "@prisma/client"
import IUser from "../interfaces/user.interface"

type prismaUser = users & {
    user_extended: user_extended[]
}

const prismaToIUserParser = (user: prismaUser): IUser => {
    return {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        password: user.password,
        coin_balance: user.user_extended[0]?.coin_balance ?? 0,
        avatar_url: user.user_extended[0]?.avatar_url,
    }
}

export default prismaToIUserParser