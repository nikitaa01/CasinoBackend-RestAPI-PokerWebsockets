"use strict";
exports.__esModule = true;
var express_1 = require("express");
var fs_1 = require("fs");
var PATH_ROUTER = "".concat(__dirname);
var router = (0, express_1.Router)();
var cleanFileName = function (fileName) {
    var file = fileName.split(".").shift();
    return file;
};
(0, fs_1.readdirSync)(PATH_ROUTER).map(function (fileName) {
    var _a;
    var cleanName = cleanFileName(fileName);
    if (cleanName !== "index") {
        (_a = "./".concat(cleanName, ".route"), Promise.resolve().then(function () { return require(_a); })).then(function (importedRouter) {
            router.use("/api/".concat(cleanName), importedRouter.router);
        });
    }
});
exports["default"] = router;
