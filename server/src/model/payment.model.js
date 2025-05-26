import pool from "../config/db.js";
import moment from "moment";
export const createTransactionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS transactions (
      id VARCHAR(50) PRIMARY KEY,
      username VARCHAR(50) NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      payment_date DATETIME DEFAULT NOW(),
      status VARCHAR(50) NOT NULL
    );
  `;
  await pool.query(query);
};

export const insertTransaction = async (transaction) => {
  const amount = parseFloat(transaction.amount/100); // Ensure amount is a number
  const formattedPaymentDate = moment(transaction.payment_date).format("YYYY-MM-DD HH:mm:ss");
  const query = `
    INSERT INTO transactions (id, username, amount, payment_date, status)VALUES (?, ?, ?, ?, ?)
  `;
  const values = [
    transaction.id,                  // Transaction ID
    transaction.username,            // Username
    amount,              // Payment amount
    formattedPaymentDate,        // Payment date
    transaction.status,              // Payment status       // Razorpay payment ID
  ];
  await pool.query(query, values);
};

// get all transactions by username 
export const getTransactionsByUsername = async (username) => {
  const query = `
    SELECT * FROM transactions WHERE username = ?  ORDER BY payment_date DESC
  `;
  const [rows] = await pool.query(query, [username]);
  return rows;
};

// get all transaction by transaction id
export const getTransactionById = async (id) => {
  const query = `
    SELECT * FROM transactions WHERE id = ?  
  `;
  const [rows] = await pool.query(query, [id]);
  return rows[0]; // Return the first row if exists
};

