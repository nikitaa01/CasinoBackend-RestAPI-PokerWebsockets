import { CronJob } from "cron"
import { createNumber } from "../controllers/roulette.controller"

// cada dos minutos 
export default new CronJob(
    "*/2 * * * *",
    createNumber,
    null,
    true,
    "Europe/Madrid",
)