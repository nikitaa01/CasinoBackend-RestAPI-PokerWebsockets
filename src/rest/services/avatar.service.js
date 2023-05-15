"use strict";
exports.__esModule = true;
exports.getSvgImage = void 0;
var util_1 = require("util");
var https_1 = require("https");
var getSvgImage = util_1["default"].promisify(function (fileName, callback) {
    var url = "https://api.dicebear.com/6.x/identicon/svg?seed=".concat(fileName);
    try {
        https_1["default"].get(url, function (res) {
            var data = '';
            res.on('data', function (chunk) {
                data += chunk;
            });
            res.on('end', function () {
                callback(null, data);
            });
        }).on('error', function (err) {
            callback(err);
        });
    }
    catch (error) {
        console.log(error);
        callback(error);
    }
});
exports.getSvgImage = getSvgImage;
