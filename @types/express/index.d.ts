import IUser from "../../src/rest/interfaces/user.interface";

declare global {
    namespace Express {
        export interface Request {
            user: IUser
        }
        export interface User extends IUser { } // eslint-disable-line @typescript-eslint/no-empty-interface
    } 
}