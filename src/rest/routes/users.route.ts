import { Router } from "express"
import { getAll, getOne } from "../controllers/users.controller"
import { authByToken } from "../middlewares/auth.mid"

const router = Router()

router.get("/", authByToken(false), getAll)

router.get("/:id", getOne)

export { router }