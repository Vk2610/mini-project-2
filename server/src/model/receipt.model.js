import pool from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

// Create receipts table if not exists
const createReceiptsTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS receipts (
        id CHAR(36) PRIMARY KEY, -- Use CHAR(36) for UUID
        name VARCHAR(255),
        address VARCHAR(255),
        mobile VARCHAR(15),
        amount VARCHAR(255),
        accountNumber VARCHAR(255),
        totalAmount VARCHAR(255),
        sendDate DATE NULL, -- Allow NULL values for sendDate
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    await pool.query(query);
};
createReceiptsTable();

// Function to insert a receipt data into the database
export const saveReceipt = async (data) => {
    // get id from user login and register table
    const { name, address, mobile, amount, accountNumber, totalAmount, sendDate } = data;
    const { id }= data; ;
    const query = `
        INSERT INTO receipts (id, name, address, mobile, amount, accountNumber, totalAmount, sendDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, name, address, mobile, amount, accountNumber, totalAmount, sendDate];

    const [result] = await pool.execute(query, values);
    return { id, ...data };
};

// get receipt by id
export const getReceiptById = async (id) => {
    const query = "SELECT * FROM receipts WHERE id = ?";
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};