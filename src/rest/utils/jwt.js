"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.verifyToken = exports.generateToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var generateToken = function (id, adicional) {
    if (adicional === void 0) { adicional = {}; }
    return jsonwebtoken_1["default"].sign(__assign({ id: id }, adicional), process.env.SECRET, {
        expiresIn: '30d'
    });
};
exports.generateToken = generateToken;
var verifyToken = function (token) {
    return jsonwebtoken_1["default"].verify(token, process.env.SECRET);
};
exports.verifyToken = verifyToken;
