"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const rouletteSchema = new mongoose_1.Schema({
    number: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const rouletteModel = (0, mongoose_1.model)('roullete_numbers', rouletteSchema);
exports.default = rouletteModel;
