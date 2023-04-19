import { Router } from "express"
import { authBySession } from "../middlewares/auth.mid"

const router = Router()

router.get('/', authBySession(), (req, res) => {
    res.send(req.session)
})

export { router }