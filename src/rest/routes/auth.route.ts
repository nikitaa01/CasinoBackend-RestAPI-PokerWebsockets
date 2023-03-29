import { Router } from "express"
import { login, register } from "../controllers/users.controller"
import { authByPassword } from "../middlewares/auth.mid"
import passport from "passport"

const router = Router()

router.post("/register", register)

router.post("/login/", authByPassword, login)

router.get("/login/google", passport.authenticate('google', { scope: ['email', 'profile'] }))

router.post("/login/google/callback", passport.authenticate('google', { failureRedirect: '/api/users/login/google' }), login)

export { router }