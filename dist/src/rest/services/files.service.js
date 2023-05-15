"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImages = exports.findImagePathByName = void 0;
const fs_1 = __importDefault(require("fs"));
const PATH_STORAGE = `${process.cwd()}/public`;
const findImagePathByName = (name) => {
    const files = fs_1.default.readdirSync(PATH_STORAGE);
    const filteredFiles = files.filter((file) => file.split(".")[0] === name);
    if (filteredFiles.length == 0)
        return undefined;
    const filePath = `${PATH_STORAGE}/${filteredFiles[0]}`;
    return filePath;
};
exports.findImagePathByName = findImagePathByName;
const deleteImages = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const files = yield fs_1.default.promises.readdir(PATH_STORAGE);
    const filteredFiles = files.filter((file) => file.split(".")[0] === name);
    yield Promise.all(filteredFiles.map((file) => __awaiter(void 0, void 0, void 0, function* () {
        yield fs_1.default.promises.unlink(`${PATH_STORAGE}/${file}`);
    })));
});
exports.deleteImages = deleteImages;
