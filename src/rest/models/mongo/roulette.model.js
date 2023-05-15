"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var rouletteSchema = new mongoose_1.Schema({
    number: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});
var rouletteModel = (0, mongoose_1.model)('roullete_numbers', rouletteSchema);
exports["default"] = rouletteModel;
