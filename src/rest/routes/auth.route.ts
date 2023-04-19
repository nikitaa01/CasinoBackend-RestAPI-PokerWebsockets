import { Router } from "express"
import { googleCallback, redirectToGoogleAuth, login, register, sendResetPassword, confirmResetPassword, callbackResetPassword } from "../controllers/auth.controller"
import { authByCredentials } from "../middlewares/auth.mid"

const router = Router()

router.post("/register", register)

router.post("/login", authByCredentials, login)

router.get("/login/google", redirectToGoogleAuth)

router.get("/login/google/callback", googleCallback)

router.post('/reset-password', sendResetPassword)

router.get('/reset-password/callback', callbackResetPassword)

router.patch('/reset-password/confirm', confirmResetPassword)

export { router }