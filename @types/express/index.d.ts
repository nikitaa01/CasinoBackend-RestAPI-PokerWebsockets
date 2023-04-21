import session from "express-session";
import  {UserPrivate} from "../../src/rest/interfaces/user.interface";


declare module 'joi' {
    interface Root {
        objectid: any;
    }
}

declare module 'express-session' {
    interface SessionData {
        token?: string;
    }
}

declare global {
    namespace Express {
        export interface Request {
            user?: UserPrivate
            session: session.Session & Partial<session.SessionData>;
        }
    }
    
}