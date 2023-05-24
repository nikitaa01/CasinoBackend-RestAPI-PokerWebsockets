import { Request, Response } from 'express';
declare const createNumber: () => Promise<void>;
declare const getLastNumber: (_req: Request, res: Response) => Promise<void>;
export { createNumber, getLastNumber };
