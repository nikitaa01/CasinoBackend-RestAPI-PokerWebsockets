"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cron_1 = require("cron");
const roulette_controller_1 = require("../controllers/roulette.controller");
// cada dos minutos 
exports.default = new cron_1.CronJob("*/2 * * * *", roulette_controller_1.createNumber, null, true, "Europe/Madrid");
