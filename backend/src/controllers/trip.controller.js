import db from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new trip
export const createTrip = asyncHandler((req, res) => {
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
});

// Get trips for logged-in user
export const getMyTrips = asyncHandler((req, res) => {
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
});

// Get trip members
export const getTripMembers = asyncHandler((req, res) => {
  const { tripId } = req.params;

  const query = `
    SELECT u.id, u.name, u.email FROM users u
    JOIN trip_members tm ON u.id = tm.user_id
    WHERE tm.trip_id = ?
  `;
  db.query(query, [tripId], (err, results) => {
    if (err) throw new ApiError(500, err.message);
    return res
      .status(200)
      .json(new ApiResponse(200, results, "Get trip members"));
  });
});

export const getTripDetail = asyncHandler((req, res) => {
  const { tripId } = req.params;

  const tripQuery = `SELECT id, name, created_at FROM trips WHERE id = ?`;
  db.query(tripQuery, [tripId], (tripErr, tripResults) => {
    if (tripErr) throw new ApiError(500, tripErr.message);

    if (tripResults.length === 0) {
      throw new ApiError(404, "Trip not found");
    }

    const trip = tripResults[0];

    const membersQuery = `
      SELECT u.id, u.name, u.email FROM users u
      JOIN trip_members tm ON u.id = tm.user_id
      WHERE tm.trip_id = ?
    `;

    db.query(membersQuery, [tripId], (memberErr, memberResults) => {
      if (memberErr) throw new ApiError(500, memberErr.message);

      const responseData = {
        trip,
        members: memberResults
      };

      return res
        .status(200)
        .json(new ApiResponse(200, responseData, "Trip detail fetched"));
    });
  });
});

// Add a member to a trip
export const addTripMember = asyncHandler((req, res) => {
  const { tripId } = req.params;
  const { userId } = req.body;

  const query = `INSERT INTO trip_members (trip_id, user_id) VALUES (?, ?)`;
  db.query(query, [tripId, userId], (err) => {
    if (err) throw new ApiError(500, err.message);
    res.json(new ApiResponse(200, {}, "Member added" ));
  });
});
