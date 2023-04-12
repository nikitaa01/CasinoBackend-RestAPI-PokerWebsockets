import { Router } from "express"
import { getAll, getOne } from "../controllers/users.controller"
import { authBySession } from "../middlewares/auth.mid"

const router = Router()

router.get("/", authBySession(false), getAll)

router.get("/:id", getOne)

export { router }