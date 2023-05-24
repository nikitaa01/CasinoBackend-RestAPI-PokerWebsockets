import { Request, Response } from "express";
declare const okNoResponse: (_req: Request, res: Response) => Response<any, Record<string, any>>;
export { okNoResponse };
