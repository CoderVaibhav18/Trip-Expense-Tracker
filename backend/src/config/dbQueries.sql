USE expense_tracker;
CREATE DATABASE expense_tracker;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);
CREATE TABLE trip_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  user_id INT NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  paid_by INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id),
  FOREIGN KEY (paid_by) REFERENCES users(id)
);
CREATE TABLE expense_splits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  expense_id INT NOT NULL,
  user_id INT NOT NULL,
  share_amount DECIMAL(10, 2) NOT NULL,
  is_settled BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (expense_id) REFERENCES expenses(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
CREATE TABLE repayments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT,
  paid_from INT,
  paid_to INT,
  amount DECIMAL(10,2),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trip_id) REFERENCES trips(id),
  FOREIGN KEY (paid_from) REFERENCES users(id),
  FOREIGN KEY (paid_to) REFERENCES users(id)
);


SELECT * FROM repayments;
SELECT * FROM expenses;