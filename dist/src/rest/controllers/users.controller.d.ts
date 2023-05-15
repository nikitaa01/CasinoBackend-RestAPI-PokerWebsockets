import { Request, Response } from 'express';
declare const getAll: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const getSelf: (req: Request, res: Response) => void;
declare const getOne: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const updateSelf: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const updateUserController: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const substractBalance: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export { getAll, getOne, deleteUser, getSelf, substractBalance, updateSelf, updateUserController };
