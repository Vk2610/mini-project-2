import { pool } from "../../config/db.js";
import moment from "moment";
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
      status ENUM('pending', 'completed', 'failed') NOT NULL
    );
  `;
  await pool.query(query);
};

createTransactionTable().catch((error) => {
  console.error("Error creating transactions table:", error);
});


export const insertTransaction = async (transaction) => {
  const { id, HRMS_No, amount, payment_date, transaction_id, status, Name } = transaction;

  if (!HRMS_No) {
    throw new Error("Username is required for transaction");
  }

  const query = `
    INSERT INTO transactions (id, HRMS_No, Name, amount, payment_date, transaction_id , status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.execute(query, [
      id,
      HRMS_No,
      Name || null, // Allow Name to be null if not provided
      amount,
      moment(payment_date).format("YYYY-MM-DD HH:mm:ss"),
      transaction_id, // Assuming transaction.id is the transaction_id
      status,
    ]);
    return result;
  } catch (error) {
    console.error("Error inserting transaction:", error);
    throw error;
  }
};

// get all transactions by HRMS_No 
export const getTransactionsByHRMS_No = async (HRMS_No) => {
  const query = `
    SELECT * FROM transactions WHERE HRMS_No = ?  ORDER BY payment_date DESC
  `;
  const [rows] = await pool.query(query, [HRMS_No]);
  return rows;
};

// get all transaction by transaction id
export const getTransactionById = async (id) => {
  const query = `
    SELECT * FROM transactions WHERE id = ?  
  `;
  const [rows] = await pool.query(query, [id]);
  return rows; // Return the first row if exists
};

export const ManualSavePayment = async (paymentData) => {
  const {
    id,
    HRMS_No,
    Name,
    email,
    amount,
    payment_date,
    transaction_id,
    status
  } = paymentData;

  // Validate required fields
  if (!HRMS_No || !amount || !transaction_id) {
    throw new Error("Missing required payment details");
  }

  // Validate status is one of the allowed ENUM values
  const validStatuses = ['pending', 'completed', 'failed'];
  const normalizedStatus = status?.toLowerCase() || 'pending';

  if (!validStatuses.includes(normalizedStatus)) {
    throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const query = `
    INSERT INTO transactions (
      id,
      HRMS_No,
      Name,
      email,
      amount,
      payment_date,
      transaction_id,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.execute(query, [
      id,
      HRMS_No,
      Name || null,
      email || null,
      amount,
      payment_date || new Date(),
      transaction_id,
      normalizedStatus // Use normalized status value
    ]);

    return result;
  } catch (error) {
    console.error("Error saving payment:", error);
    throw new Error(`Failed to save payment: ${error.message}`);
  }
};

