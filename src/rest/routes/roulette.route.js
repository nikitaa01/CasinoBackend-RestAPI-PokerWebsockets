"use strict";
exports.__esModule = true;
exports.router = void 0;
var express_1 = require("express");
var roulette_controller_1 = require("../controllers/roulette.controller");
var router = (0, express_1.Router)();
exports.router = router;
router.get("/", roulette_controller_1.getLastNumber);
