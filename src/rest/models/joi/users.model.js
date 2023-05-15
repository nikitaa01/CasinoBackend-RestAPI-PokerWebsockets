"use strict";
exports.__esModule = true;
exports.userSchema = void 0;
var joi_1 = require("joi");
exports.userSchema = joi_1["default"].object({
    role: joi_1["default"].string().valid("USER", "ADMIN").optional(),
    email: joi_1["default"].string().email().required(),
    first_name: joi_1["default"].string().required(),
    last_name: joi_1["default"].string().required(),
    password: joi_1["default"].string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})')).required()
});
