import db from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const calculateBalances = asyncHandler((req, res) => {
  const { tripId } = req.params;

  const query = `
    SELECT 
      u.id AS user_id, u.name,
      IFNULL(SUM(CASE WHEN e.paid_by = u.id THEN e.amount ELSE 0 END), 0) AS total_paid,
      IFNULL(SUM(es.share_amount), 0) AS total_share
    FROM trip_members tm
    JOIN users u ON tm.user_id = u.id
    LEFT JOIN expenses e ON e.paid_by = u.id AND e.trip_id = ?
    LEFT JOIN expense_splits es ON es.user_id = u.id
    JOIN expenses e2 ON es.expense_id = e2.id AND e2.trip_id = ?
    WHERE tm.trip_id = ?
    GROUP BY u.id;
  `;

  db.query(query, [tripId, tripId, tripId], (err, results) => {
    if (err) throw new ApiError(500, err.message);

    const balances = results.map((user) => ({
      user_id: user.user_id,
      name: user.name,
      total_paid: parseFloat(user.total_paid),
      total_share: parseFloat(user.total_share),
      balance: parseFloat(user.total_paid - user.total_share),
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(200, { balances }, "Calculate Balances successfully")
      );
  });
});
