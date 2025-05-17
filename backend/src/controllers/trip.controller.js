import db from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createTrip = (req, res) => {
  const { name, description, memberIds } = req.body;
  const createdBy = req.user.userId;

  db.query(
    `INSERT INTO trips (name, description, created_by) VALUES (?, ?, ?)`,
    [name, description, createdBy],
    (err, result) => {
      if (err) throw new ApiError(500, err.message);

      const tripId = result.insertId;
      const allMembers = [...new Set([createdBy, ...memberIds])];

      const values = allMembers.map((userId) => [tripId, userId]);
      db.query(
        `INSERT INTO trip_members (trip_id, user_id) VALUES ?`,
        [values],
        (err2) => {
          if (err2) throw new ApiError(500, err2.message);
          return res
            .status(201)
            .json(new ApiResponse(201, tripId, "Trip created"));
        }
      );
    }
  );
};
