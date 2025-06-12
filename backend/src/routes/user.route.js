import express from "express";
import { login,  profile, register } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(register); 

router.route("/login").post(login);

router.route("/profile").get(verifyJwt, profile);

export default router;
