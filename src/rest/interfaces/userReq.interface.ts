import { Request } from 'express'
import IUser from './user.interface'

export default interface UserReq extends Request {
    user?: IUser
}