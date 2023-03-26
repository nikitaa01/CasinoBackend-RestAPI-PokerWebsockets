import { Router } from "express"
import { getAll, getAvatar, login, register } from "../controllers/users.controller"
import { authByPassword, authByToken } from "../middlewares/auth.mid"
import multerMiddleware from "../middlewares/files.mid"
import { okNoResponse } from "../controllers/generic.controller"
import passport from "passport"

const router = Router()

router.get("/", getAll)

router.post("/register", register)

router.post("/login/", authByPassword, login)

router.get("/login/google", passport.authenticate('google', { scope: ['email'] }))

router.get("/login/google/callback", passport.authenticate('google', { failureRedirect: '/api/users/login/google' }), (req, res) => {
    res.send(req.user)
})

router.get("/avatar/:id?", authByToken(false), getAvatar)

router.post('/avatar', authByToken(), multerMiddleware.single('avatar'), okNoResponse)

export { router }