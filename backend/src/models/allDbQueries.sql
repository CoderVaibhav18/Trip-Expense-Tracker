-- USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- TRIPS TABLE
CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_by INT,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- TRIP MEMBERS TABLE
CREATE TABLE trip_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- EXPENSES TABLE
CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT NOT NULL,
    paid_by INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id),
    FOREIGN KEY (paid_by) REFERENCES users(id)
);

-- EXPENSE SPLITS TABLE
CREATE TABLE expense_splits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_id INT NOT NULL,
    user_id INT NOT NULL,
    share_amount DECIMAL(10,2) NOT NULL,
    is_settled BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (expense_id) REFERENCES expenses(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- -------------------------------------------------
-- COMMON QUERIES
-- -------------------------------------------------

-- 1. Get all members of a specific trip
SELECT u.id, u.name, u.email
FROM users u
JOIN trip_members tm ON u.id = tm.user_id
WHERE tm.trip_id = ?;

-- 2. Get all expenses of a specific trip (with who paid)
SELECT e.*, e.date, u.name AS paid_by_name
FROM expenses e
JOIN users u ON e.paid_by = u.id
WHERE e.trip_id = ?
ORDER BY e.date DESC;

-- 3. Calculate balances per user in a trip
SELECT 
  u.id AS user_id,
  u.name,
  IFNULL(SUM(CASE WHEN e.paid_by = u.id THEN e.amount ELSE 0 END), 0) AS total_paid,
  IFNULL(SUM(es.share_amount), 0) AS total_share
FROM trip_members tm
JOIN users u ON tm.user_id = u.id
LEFT JOIN expenses e ON e.paid_by = u.id AND e.trip_id = ?
LEFT JOIN expense_splits es ON es.user_id = u.id
JOIN expenses e2 ON es.expense_id = e2.id AND e2.trip_id = ?
WHERE tm.trip_id = ?
GROUP BY u.id;

-- 4. Get summary of who owes whom
SELECT 
  es.user_id,
  SUM(es.share_amount) AS total_owed,
  e.paid_by,
  SUM(CASE WHEN es.user_id != e.paid_by THEN es.share_amount ELSE 0 END) AS owes_to_payer
FROM expense_splits es
JOIN expenses e ON es.expense_id = e.id
WHERE e.trip_id = ?
GROUP BY es.user_id, e.paid_by;

-- 5. Get only users who paid for expenses in the trip
SELECT DISTINCT 
  u.id AS user_id,
  u.name
FROM expenses e
JOIN users u ON e.paid_by = u.id
WHERE e.trip_id = ?;

-- 6. Get users who paid, with total amount paid
SELECT 
  u.id AS user_id,
  u.name,
  SUM(e.amount) AS total_paid
FROM expenses e
JOIN users u ON e.paid_by = u.id
WHERE e.trip_id = ?
GROUP BY u.id, u.name
ORDER BY total_paid DESC;

-- 7. Get users who paid and how much others owe them (owed_to)
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

-- 8. Get trip name and creator
SELECT 
  t.id AS trip_id,
  t.name AS trip_name,
  u.name AS created_by
FROM trips t
JOIN users u ON t.created_by = u.id
WHERE t.id = ?;
