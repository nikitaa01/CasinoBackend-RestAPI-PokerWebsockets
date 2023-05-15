"use strict";
exports.__esModule = true;
var gidGenerator = function (num) {
    if (num === void 0) { num = 5; }
    return Array.from(Array(num), function () { return Math.floor(Math.random() * 36).toString(36); }).join('').toUpperCase();
};
exports["default"] = gidGenerator;
