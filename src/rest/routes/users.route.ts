import { Router } from "express"
import { deleteUser, getAll, getOne, getSelf, substractBalance, updateSelf, updateUserController } from "../controllers/users.controller"
import { auth } from "../middlewares/auth.mid"

const router = Router()

router.get("/", getAll)

router.get('/self', auth(), getSelf)

router.get("/:id", getOne)

router.delete("/self", auth(), deleteUser)

router.put('/self', auth(), updateSelf)

router.put('/:id', auth(), updateUserController)

router.post("/substract-balance", auth(), substractBalance)

export { router }