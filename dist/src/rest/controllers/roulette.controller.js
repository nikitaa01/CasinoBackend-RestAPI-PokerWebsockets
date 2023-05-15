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
exports.getLastNumber = exports.createNumber = void 0;
const roulette_service_1 = require("../services/roulette.service");
const createNumber = () => __awaiter(void 0, void 0, void 0, function* () {
    const number = Math.floor(Math.random() * 36);
    const roulette = {
        number,
    };
    (0, roulette_service_1.create)(roulette);
});
exports.createNumber = createNumber;
const getLastNumber = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lastRoulette = yield (0, roulette_service_1.getLast)();
    res.send(lastRoulette);
});
exports.getLastNumber = getLastNumber;
