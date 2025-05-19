import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getRepaymentHistory,
  recordRepayment,
} from "../controllers/repayment.controller.js";

const router = Router();

router.route("/:tripId").post(verifyJwt, recordRepayment);

router.route("/:tripId").get(verifyJwt, getRepaymentHistory);

export default router;
