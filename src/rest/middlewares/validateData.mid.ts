import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

const validateData = (schema: ObjectSchema<any>, validation: 'params' | 'query' | 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req[validation]);
        if (error) {
            return res.status(400).json({
                errors: error.details.map((detail) => detail.message)
            });
        }
        next();
    };
}

export default validateData;