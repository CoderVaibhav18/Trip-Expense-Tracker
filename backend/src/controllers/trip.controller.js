import db from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new trip
export const createTrip = (req, res) => {
  const { name, description, memberIds } = req.body;
  const createdBy = req.user.userId;

  db.query(
    `INSERT INTO trips (name, description, created_by) VALUES (?, ?, ?)`,
    [name, description, createdBy],
    (err, result) => {
      if (err) throw new ApiError(500, err.message);

      const tripId = result.insertId; // this is trip id
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

// Get trips for logged-in user
export const getMyTrips = (req, res) => {
  const userId = req.user.userId;
  const query = `
    SELECT t.* FROM trips t
    JOIN trip_members tm ON t.id = tm.trip_id
    WHERE tm.user_id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) throw new ApiError(500, err.message);
    return res.status(200).json(new ApiResponse(200, results, "Get my trips"));
  });
};

// Get trip members
export const getTripMembers = (req, res) => {
  const { tripId } = req.params;

  const query = `
    SELECT u.id, u.name, u.email FROM users u
    JOIN trip_members tm ON u.id = tm.user_id
    WHERE tm.trip_id = ?
  `;
  db.query(query, [tripId], (err, results) => {
    if (err) throw new ApiError(500, err.message);
    return res.status(200).json(new ApiResponse(200, results, "Get trip members"));
  });
};

// Add a member to a trip
export const addTripMember = (req, res) => {
  const { tripId } = req.params;
  const { userId } = req.body;

  const query = `INSERT INTO trip_members (trip_id, user_id) VALUES (?, ?)`;
  db.query(query, [tripId, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Member added' });
  });
};