import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createTrip, getMyTrips } from "../controllers/trip.controller.js";
const router = express.Router();

router.route("/create").post(verifyJwt, createTrip);

router.route("/my-trips").get(verifyJwt, getMyTrips);

export default router;
