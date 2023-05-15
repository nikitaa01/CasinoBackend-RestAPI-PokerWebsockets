"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const users_controller_1 = require("../controllers/users.controller");
const auth_mid_1 = require("../middlewares/auth.mid");
const router = (0, express_1.Router)();
exports.router = router;
router.get("/", users_controller_1.getAll);
router.get('/self', (0, auth_mid_1.auth)(), users_controller_1.getSelf);
router.get("/:id", users_controller_1.getOne);
router.delete("/self", (0, auth_mid_1.auth)(), users_controller_1.deleteUser);
router.put('/self', (0, auth_mid_1.auth)(), users_controller_1.updateSelf);
router.put('/:id', (0, auth_mid_1.auth)(), users_controller_1.updateUserController);
router.post("/substract-balance", (0, auth_mid_1.auth)(), users_controller_1.substractBalance);