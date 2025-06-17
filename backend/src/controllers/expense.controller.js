import db from "../config/db.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Add Expense with Auto-Split
export const addExpense = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const { amount, description } = req.body;
  const selectedMembers = JSON.parse(req.body.members);
  const paidBy = req.user.userId;

  const imageUrl = req.file ? req.file.path : null;

  // Step 1: Insert expense into the `expenses` table
  db.query(
    `INSERT INTO expenses (trip_id, paid_by, amount, description, image_url) VALUES (?, ?, ?, ?, ?)`,
    [tripId, paidBy, amount, description, imageUrl],
    (err, result) => {
      if (err) throw new ApiError(500, err.message);

      const expenseId = result.insertId;

      // Step 2: Ensure selectedMembers is valid
      if (
        !selectedMembers ||
        !Array.isArray(selectedMembers) ||
        selectedMembers.length === 0
      ) {
        throw new ApiError(400, "selectedMembers must be a non-empty array");
      }

      // Step 3: Calculate share and create split entries
      const share = parseFloat((amount / selectedMembers.length).toFixed(2));
      const splits = selectedMembers.map((user_id) => [
        expenseId,
        user_id,
        share,
        false,
      ]);

      // Step 4: Insert splits into expense_splits
      db.query(
        `INSERT INTO expense_splits (expense_id, user_id, share_amount, is_settled) VALUES ?`,
        [splits],
        (err2) => {
          if (err2) throw new ApiError(500, err2.message);
          return res
            .status(201)
            .json(
              new ApiResponse(
                201,
                expenseId,
                "Expense added and split among selected members"
              )
            );
        }
      );
    }
  );
});

//  Get Trip Expenses
export const getTripExpenses = asyncHandler(async (req, res) => {
  const { tripId } = req.params;

  const query = `
    SELECT 
      e.id,
      e.trip_id,
      e.amount,
      e.description,
      e.image_url,
      e.paid_by,
      e.date,
      u.name AS paid_by_name,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'id', m.id,
          'name', m.name,
          'email', m.email
        )
      ) AS members
    FROM expenses e
    JOIN users u ON e.paid_by = u.id
    LEFT JOIN expense_splits em ON e.id = em.expense_id
    LEFT JOIN users m ON em.user_id = m.id
    WHERE e.trip_id = ?
    GROUP BY e.id
    ORDER BY e.date DESC
  `;

  db.query(query, [tripId], (err, results) => {
    if (err) throw new ApiError(500, err.message);

    console.log(results);
    

    // Parse the JSON arrays for members before sending
    const parsedResults = results.map((expense) => ({
      ...expense,
      members: expense.members,
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          parsedResults,
          "Get all trip expenses with members"
        )
      );
  });
});

// Get Trip Summary (Balances)
export const getTripSummary = asyncHandler(async (req, res) => {
  const { tripId } = req.params;
  const query = `
    SELECT 
      es.user_id,
      SUM(es.share_amount) AS total_owed,
      e.paid_by,
      SUM(CASE WHEN es.user_id != e.paid_by THEN es.share_amount ELSE 0 END) AS owes_to_payer
    FROM expense_splits es
    JOIN expenses e ON es.expense_id = e.id
    WHERE e.trip_id = ?
    GROUP BY es.user_id, e.paid_by
  `;

  db.query(query, [tripId], (err, results) => {
    if (err) throw new ApiError(500, err.message);

    // Transform raw results into a { [userId]: { owes: [{toUser, amount}] } } structure
    const summary = {};
    results.forEach((r) => {
      if (r.user_id === r.paid_by) return; // skip self
      if (!summary[r.user_id]) summary[r.user_id] = [];
      summary[r.user_id].push({
        owesTo: r.paid_by,
        amount: Number(r.owes_to_payer),
      });
    });

    res.status(200).json(new ApiResponse(200, summary, "Expense summary"));
  });
});
