"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const avatar_controller_1 = require("../controllers/avatar.controller");
const files_mid_1 = __importDefault(require("../middlewares/files.mid"));
const generic_controller_1 = require("../controllers/generic.controller");
const auth_mid_1 = require("../middlewares/auth.mid");
const router = (0, express_1.Router)();
exports.router = router;
router.get("/:id", avatar_controller_1.getAvatar);
router.post('/', (0, auth_mid_1.auth)(), files_mid_1.default.single('avatar'), generic_controller_1.okNoResponse);
