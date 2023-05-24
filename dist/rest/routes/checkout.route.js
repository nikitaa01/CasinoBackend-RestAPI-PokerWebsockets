"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const checkout_controller_1 = require("../controllers/checkout.controller");
const router = (0, express_1.Router)();
exports.router = router;
router.post('/get-code', checkout_controller_1.getCode);
router.get('/confirm', checkout_controller_1.confirmPayment);
