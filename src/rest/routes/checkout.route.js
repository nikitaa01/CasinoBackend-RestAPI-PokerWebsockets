"use strict";
exports.__esModule = true;
exports.router = void 0;
var express_1 = require("express");
var checkout_controller_1 = require("../controllers/checkout.controller");
var router = (0, express_1.Router)();
exports.router = router;
router.post('/get-code', checkout_controller_1.getCode);
router.get('/confirm', checkout_controller_1.confirmPayment);
