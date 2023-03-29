import { Router } from "express"
import { getAvatar } from "../controllers/users.controller"
import { authByToken } from "../middlewares/auth.mid"
import multerMiddleware from "../middlewares/files.mid"
import { okNoResponse } from "../controllers/generic.controller"

const router = Router()

router.get("/:id", getAvatar)

router.post('/', authByToken(), multerMiddleware.single('avatar'), okNoResponse)

export { router }