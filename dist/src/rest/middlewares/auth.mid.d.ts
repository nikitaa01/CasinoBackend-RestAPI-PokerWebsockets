import { Request, Response, NextFunction } from 'express';
declare const auth: (strict?: boolean) => (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
declare const authByCredentials: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export { auth, authByCredentials };
