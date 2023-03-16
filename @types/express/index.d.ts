import User from "../../src/rest/interfaces/user.interface";

declare global {
    namespace Express {
        export interface Request {
            user: User
        }
    } 
}