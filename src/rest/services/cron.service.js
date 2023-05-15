"use strict";
exports.__esModule = true;
var cron_1 = require("cron");
var roulette_controller_1 = require("../controllers/roulette.controller");
// cada dos minutos 
exports["default"] = new cron_1.CronJob("*/2 * * * *", roulette_controller_1.createNumber, null, true, "Europe/Madrid");
