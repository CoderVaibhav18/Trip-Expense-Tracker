import express from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createTrip, getMyTrips, getTripMembers } from "../controllers/trip.controller.js";
const router = express.Router();

router.route("/create").post(verifyJwt, createTrip);

router.route("/my-trips").get(verifyJwt, getMyTrips);

router.route("/:tripId/members").get(verifyJwt, getTripMembers);

export default router;
