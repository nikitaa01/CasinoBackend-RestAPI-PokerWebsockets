import { Router } from "express"
import { getAvatar } from "../controllers/avatar.controller"
import multerMiddleware from "../middlewares/files.mid"
import { okNoResponse } from "../controllers/generic.controller"
import { authBySession } from "../middlewares/auth.mid"

const router = Router()

router.get("/:id", getAvatar)

router.post('/', authBySession(), multerMiddleware.single('avatar'), okNoResponse)

export { router }