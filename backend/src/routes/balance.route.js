import { Router } from "express";
import { calculateBalances,  getTripPayeesWithOwedAmount } from "../controllers/balance.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/:tripId/balance').get(verifyJwt, calculateBalances)

router.route('/:tripId/trip-payee').get(verifyJwt, getTripPayeesWithOwedAmount)

export default router;
