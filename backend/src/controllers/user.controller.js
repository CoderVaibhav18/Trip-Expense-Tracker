import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Register user
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], async (err, result) => {
    if (err) throw err;

    if (result.length > 0) {
      throw new ApiError(400, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err, result) => {
        if (err) throw new err();
        console.log("user register");
        return res.status(201).json({ meggage: "User register successfully"});
      }
    );
  });
});

// Login user
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = ?`;
  db.query(query, [email], async (err, results) => {
    if (err || results.length === 0) {
      throw new ApiError(401, "Invalid credential");
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(401, "Unauthorizes user");

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_SECRET_EXPIRY,
      }
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            id: user.id,
            name: user.name,
            email: user.email,
            created_at: user.created_at,
          },
          "user logged in successfully"
        )
      );
  });
});

export const profile = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "profile"));
});
