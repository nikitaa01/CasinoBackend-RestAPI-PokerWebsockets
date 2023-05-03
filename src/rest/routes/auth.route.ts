import { Router } from "express"
import { googleCallback, redirectToGoogleAuth, login, register, sendResetPassword, confirmResetPassword, logout } from "../controllers/auth.controller"
import { authByCredentials, auth } from "../middlewares/auth.mid"
import validateData from "../middlewares/validateData.mid"
import { userSchema } from "../models/joi/users.model"

const router = Router()

router.post("/register", validateData(userSchema, 'body'), auth(false), register)

router.post("/login", authByCredentials, login)

router.post("/logout", auth(), logout)

router.get("/login/google", redirectToGoogleAuth)

router.get("/login/google/callback", googleCallback)

router.post('/reset-password', sendResetPassword)

router.patch('/reset-password/confirm', confirmResetPassword)

export { router }