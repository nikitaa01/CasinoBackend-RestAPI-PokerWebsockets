"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateData = (schema, validation) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[validation]);
        if (error) {
            return res.status(400).json({
                errors: error.details.map((detail) => detail.message)
            });
        }
        next();
    };
};
exports.default = validateData;
