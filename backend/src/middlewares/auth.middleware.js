import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import db from '../config/db.js'

export const verifyJwt = asyncHandler(async (req, res,next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");      

    if (!token) {
      throw new ApiError(401, "Unauthorized access token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, err.message || "unauthorized access");
  }
});
