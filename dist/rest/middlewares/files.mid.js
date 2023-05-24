"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importStar(require("multer"));
const files_service_1 = require("../services/files.service");
const users_service_1 = require("../services/users.service");
const PATH_STORAGE = `${process.cwd()}/public`;
const storage = (0, multer_1.diskStorage)({
    destination(_req, _file, cb) {
        cb(null, PATH_STORAGE);
    },
    filename(req, file, cb) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const extensions = ["jpg", "jpeg", "png", "gif", "bmp", "tif", "tiff", "raw", "svg", "webp"];
            const ext = file.originalname.split(".").pop();
            if (!extensions.includes(ext)) {
                return cb("Extension not allowed");
            }
            const fileName = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) ? `${req.user.id}.${ext}` : `file-${Date.now()}.${ext}`;
            if ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) {
                if (req.user.avatar_url.startsWith('http')) {
                    (0, users_service_1.updateUser)(req.user.id, { avatar_url: `/api/avatar/${req.user.id}` });
                }
                yield (0, files_service_1.deleteImages)(String(req.user.id));
            }
            cb(null, fileName);
        });
    },
});
const multerMiddleware = (0, multer_1.default)({ storage });
exports.default = multerMiddleware;
