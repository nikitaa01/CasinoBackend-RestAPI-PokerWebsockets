import { Router } from "express"
import { deleteUser, getAll, getOne, getSelf, substractBalance, updateSelf } from "../controllers/users.controller"
import { auth } from "../middlewares/auth.mid"

const router = Router()

router.get("/", getAll)

router.get('/self', auth(), getSelf)

router.get("/:id", getOne)

router.delete("/", auth(), deleteUser)

router.put('/self', auth(), updateSelf)

router.post("/substract-balance", auth(), substractBalance)

export { router }