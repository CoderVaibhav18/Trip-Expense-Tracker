import { Router } from "express";
import { calculateBalances } from "../controllers/balance.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/:tripId/balance').get(verifyJwt, calculateBalances)

export default router;
