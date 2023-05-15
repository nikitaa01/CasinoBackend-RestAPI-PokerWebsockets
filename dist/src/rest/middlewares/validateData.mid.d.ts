import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
declare const validateData: (schema: ObjectSchema<any>, validation: 'params' | 'query' | 'body') => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default validateData;
