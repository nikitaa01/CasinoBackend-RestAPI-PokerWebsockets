"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    role: joi_1.default.string().valid("USER", "ADMIN").optional(),
    email: joi_1.default.string().email().required(),
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().required(),
    password: joi_1.default.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})')).required(),
});
