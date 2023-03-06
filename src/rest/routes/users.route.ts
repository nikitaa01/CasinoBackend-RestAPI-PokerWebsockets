import { Router } from "express"
import { getAll, getAvatar, login } from "../controllers/users.controller"
import { authBySecret, authByToken } from "../middlewares/auth.mid"
import multerMiddleware from "../middlewares/files.mid"
import { okNoResponse } from "../controllers/generic.controller"

const router = Router()

router.get("/", getAll)

router.post("/login/:id", authBySecret, login)

router.get("/avatar/:id?", authByToken(false), getAvatar)

router.post('/avatar', authByToken(), multerMiddleware.single('avatar'), okNoResponse)

export { router }