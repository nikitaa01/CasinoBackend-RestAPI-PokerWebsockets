import User, { UserPrivate } from '../interfaces/user.interface'

type UserResponse = Promise<{ ok: false, } | { ok: true, user: User | UserPrivate }>

export default UserResponse