import { Request, Response } from 'express';
declare const getAvatar: (req: Request, res: Response) => Promise<void | Response<any, Record<string, any>>>;
export { getAvatar };
