import db from "../config/db.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const calculateBalances = asyncHandler((req, res) => {
  const { tripId } = req.params;

  const query = `
    SELECT 
      t.name AS trip_name,
      u.id AS user_id,
      u.name,
      COALESCE(SUM(DISTINCT CASE WHEN e.trip_id = ? AND e.paid_by = u.id THEN e.amount ELSE 0 END), 0) AS total_paid,
      COALESCE(SUM(DISTINCT CASE WHEN e2.trip_id = ? AND es.user_id = u.id THEN es.share_amount ELSE 0 END), 0) AS total_share
    FROM trip_members tm
    JOIN users u ON tm.user_id = u.id
    JOIN trips t ON tm.trip_id = t.id
    LEFT JOIN expenses e ON e.paid_by = u.id AND e.trip_id = ?
    LEFT JOIN expense_splits es ON es.user_id = u.id
    LEFT JOIN expenses e2 ON es.expense_id = e2.id AND e2.trip_id = ?
    WHERE tm.trip_id = ?
    GROUP BY u.id, u.name, t.name;
  `;

  db.query(query, [tripId, tripId, tripId, tripId, tripId], (err, results) => {
    if (err) throw new ApiError(500, err.message);

    if (!results.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Trip not found or has no members"));
    }

    const tripName = results[0].trip_name;

    const balances = results.map((user) => {
      const totalPaid = parseFloat(user.total_paid);
      const totalShare = parseFloat(user.total_share);
      const balance = totalShare - totalPaid;

      return {
        user_id: user.user_id,
        name: user.name,
        total_paid: totalPaid,
        total_share: totalShare,
        balance: parseFloat(balance.toFixed(2)),
      };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { trip_name: tripName, balances },
          "Trip balances calculated"
        )
      );
  });
});

export const getTripPayeesWithOwedAmount = asyncHandler((req, res) => {
  const { tripId } = req.params;

  const query = `
    SELECT 
      u.id AS user_id,
      u.name,
      SUM(e.amount) AS total_paid,
      SUM(CASE 
            WHEN es.user_id != e.paid_by THEN es.share_amount
            ELSE 0
          END) AS owed_to
    FROM expenses e
    JOIN users u ON u.id = e.paid_by
    LEFT JOIN expense_splits es ON es.expense_id = e.id
    WHERE e.trip_id = ?
    GROUP BY u.id, u.name
    HAVING total_paid > 0;
  `;

  db.query(query, [tripId], (err, results) => {
    if (err) throw new ApiError(500, err.message);

    const data = results.map((row) => ({
      user_id: row.user_id,
      name: row.name,
      total_paid: Number(parseFloat(row.total_paid).toFixed(2)),
      owed_to: Number(parseFloat(row.owed_to).toFixed(2)),
    }));

    return res.status(200).json(
      new ApiResponse(200, data, "Payees with total paid and owed amount")
    );
  });
});
    
