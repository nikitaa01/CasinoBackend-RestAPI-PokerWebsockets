"use strict";
exports.__esModule = true;
var validateData = function (schema, validation) {
    return function (req, res, next) {
        var error = schema.validate(req[validation]).error;
        if (error) {
            return res.status(400).json({
                errors: error.details.map(function (detail) { return detail.message; })
            });
        }
        next();
    };
};
exports["default"] = validateData;
