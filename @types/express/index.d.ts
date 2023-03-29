import session from "express-session";
import PersUser from "../../src/rest/interfaces/user.interface";

declare module 'express-session' {
    interface SessionData {
        token?: string;
    }
}
declare global {

    namespace Express {
        /* export interface Request {
            user: User
        } */
        export interface User extends PersUser { } // eslint-disable-line @typescript-eslint/no-empty-interface
        export interface Request {
            session: session.Session & Partial<session.SessionData>;
         }
    }
    
}