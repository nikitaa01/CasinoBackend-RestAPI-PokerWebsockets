import Joi from "joi";

export const userSchema = Joi.object({
    role: Joi.string().valid("USER", "ADMIN").optional(),
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    password: Joi.string().required(),
});