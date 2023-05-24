"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const roulette_controller_1 = require("../controllers/roulette.controller");
const router = (0, express_1.Router)();
exports.router = router;
router.get("/", roulette_controller_1.getLastNumber);
