import IUser from '../interfaces/user.interface'

type UserResponse = Promise<{ ok: false, } | { ok: true, user: IUser }>

export default UserResponse