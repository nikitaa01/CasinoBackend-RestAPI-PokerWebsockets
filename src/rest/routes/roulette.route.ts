import { Router } from "express"
import { getLastNumber } from "../controllers/roulette.controller"

const router = Router()

router.get("/", getLastNumber)

export { router }