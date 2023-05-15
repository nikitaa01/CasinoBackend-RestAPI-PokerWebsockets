"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSvgImage = void 0;
const util_1 = __importDefault(require("util"));
const https_1 = __importDefault(require("https"));
const getSvgImage = util_1.default.promisify((fileName, callback) => {
    const url = `https://api.dicebear.com/6.x/identicon/svg?seed=${fileName}`;
    try {
        https_1.default.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                callback(null, data);
            });
        }).on('error', (err) => {
            callback(err);
        });
    }
    catch (error) {
        console.log(error);
        callback(error);
    }
});
exports.getSvgImage = getSvgImage;
