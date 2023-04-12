import { Router } from "express"
import { googleCallback, redirectToGoogleAuth, login, register } from "../controllers/auth.controller"
import { authByCredentials } from "../middlewares/auth.mid"

const router = Router()

router.post("/register", register)

router.post("/login", authByCredentials, login)

router.get("/login/google", redirectToGoogleAuth)

router.get("/login/google/callback", googleCallback)

export { router }