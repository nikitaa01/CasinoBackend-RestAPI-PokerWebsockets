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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAvatar = void 0;
const avatar_service_1 = require("../services/avatar.service");
const files_service_1 = require("../services/files.service");
const getAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const fileName = req.params.id;
    const routeImg = (0, files_service_1.findImagePathByName)(fileName);
    if (routeImg) {
        return res.sendFile(routeImg);
    }
    try {
        const svgImage = yield (0, avatar_service_1.getSvgImage)(fileName);
        res.setHeader('Content-Type', 'image/svg+xml');
        res.send(svgImage);
    }
    catch (error) {
        return res.sendStatus(500);
    }
});
exports.getAvatar = getAvatar;
