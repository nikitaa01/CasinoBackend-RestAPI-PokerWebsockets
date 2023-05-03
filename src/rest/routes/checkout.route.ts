import { Router } from "express";
import { confirmPayment, getCode } from "../controllers/checkout.controller";

const router = Router()

router.post('/get-code', getCode)

router.get('/confirm', confirmPayment)

export { router }