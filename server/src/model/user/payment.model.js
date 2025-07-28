
import { pool } from "../../config/db.js";
const createTransactionTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS transactions (
      id VARCHAR(100),
      HRMS_No VARCHAR(100) NULL,
      Name VARCHAR(100) NULL,
      email VARCHAR(100) NULL,
      amount DECIMAL(10, 2) NOT NULL,
      payment_date DATETIME NOT NULL,
      transaction_id VARCHAR(100) NOT NULL,
      payment_SS VARCHAR(255) NULL,
      status ENUM('pending', 'completed', 'failed') NOT NULL
    );
  `;
  await pool.query(query);
  console.log("Transactions table created or already exists.");
};

createTransactionTable().catch((error) => {
  console.error("Error creating transactions table:", error);
});

export const addPayment = async (paymentData) => {
  const {
    HRMS_No,
    name,
    email,
    amount,
    payment_date,
    transaction_id,
    paymentSS
  } = paymentData;

  const query = `
    INSERT INTO transactions
      (id, HRMS_No, Name, email, amount, payment_date, transaction_id, payment_SS, status)
    VALUES
      (UUID(), ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;

  const values = [
    HRMS_No,
    name,
    email,
    amount,
    payment_date,
    transaction_id,
    paymentSS
  ];

  const [result] = await pool.query(query, values);
  return result;
};

// fetch paymments by HRMS_No
export const getTransactionsByHRMS_No = async (HRMS_No) => {
  const query = `
    SELECT * FROM transactions
    WHERE HRMS_No = ?
    ORDER BY payment_date DESC
  `;
  const [rows] = await pool.query(query, [HRMS_No]);
  return rows;
};

