import { Request, Response } from "express";
declare const redirectToGoogleAuth: (_req: Request, res: Response) => void;
declare const googleCallback: (req: Request, res: Response) => Promise<void>;
declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const logout: (req: Request, res: Response) => Promise<void>;
declare const sendResetPassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
declare const confirmResetPassword: ({ body, session }: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export { redirectToGoogleAuth, googleCallback, register, login, logout, sendResetPassword, confirmResetPassword };
