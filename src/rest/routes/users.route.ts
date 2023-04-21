import { Router } from "express"
import { deleteUser, getAll, getOne, getSelf, substractBalance } from "../controllers/users.controller"
import { authBySession } from "../middlewares/auth.mid"

const router = Router()

router.get("/", getAll)

router.get('/self', authBySession(), getSelf)

router.get("/:id", getOne)

router.delete("/", authBySession(), deleteUser)

router.post("/add-balance", )

router.post("/substract-balance", authBySession(), substractBalance)

export { router }