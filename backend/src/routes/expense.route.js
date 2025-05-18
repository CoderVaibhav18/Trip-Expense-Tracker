import express from "express";
import { addExpense, getTripExpenses, getTripSummary } from "../controllers/expense.controller.js";
import { upload } from "../middlewares/uploads.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/add/:tripId").post(upload.single("bill"),verifyJwt, addExpense);

router.route("/trip/:tripId").get(verifyJwt, getTripExpenses);

router.route("/trip/:tripId/summary").get(verifyJwt, getTripSummary);

export default router;
