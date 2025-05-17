import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createTrip } from "../controllers/trip.controller.js";
const router = express.Router();

router.route('/create').post(verifyJwt, createTrip)

export default router