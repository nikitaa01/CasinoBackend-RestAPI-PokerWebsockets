import { Request, Response } from 'express';
declare const getCode: (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
declare const confirmPayment: (req: Request, res: Response) => Promise<void>;
export { getCode, confirmPayment };
