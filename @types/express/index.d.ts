import session from "express-session";
import {UserPrivate} from "../../src/rest/interfaces/user.interface";

declare module 'express-session' {
    interface SessionData {
        token?: string;
    }
}
declare global {
    namespace Express {
        export interface Request {
            user?: UserPrivate | User
            session: session.Session & Partial<session.SessionData>;
        }
    }
    
}