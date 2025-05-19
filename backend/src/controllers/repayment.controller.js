import db from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const recordRepayment = asyncHandler((req, res) => {
  const { tripId } = req.params;
  const paidFrom = req.user.userId;
  const { paidTo, amount } = req.body

  const query = `
    INSERT INTO repayments (trip_id, paid_from, paid_to, amount)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [tripId, paidFrom, paidTo, amount], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Repayment recorded successfully." });
  });
});

export const getRepaymentHistory = asyncHandler((req, res) => {
  const { tripId } = req.params;

  const query = `
    SELECT r.*, u1.name AS fromUser, u2.name AS toUser
    FROM repayments r
    JOIN users u1 ON r.paid_from = u1.id
    JOIN users u2 ON r.paid_to = u2.id
    WHERE r.trip_id = ?
    ORDER BY r.timestamp DESC
  `;

  db.query(query, [tripId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ repayments: results });
  });
});
