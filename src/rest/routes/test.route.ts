import { Router } from "express"
import { authBySession } from "../middlewares/auth.mid"

const router = Router()

router.get('/', (req, res) => {
    res.send(req.session)
})

export { router }