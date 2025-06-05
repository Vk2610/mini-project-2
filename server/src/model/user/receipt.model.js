import { pool } from "../../config/db.js";
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
        signature VARCHAR(2083),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    await pool.query(query);
};
createReceiptsTable();



// Function to insert a receipt data into the database
export const saveReceipt = async (data) => {
    try {
        const { 
            id,
            name, 
            address, 
            mobile, 
            amount, 
            accountNumber, 
            totalAmount, 
            sendDate, 
            signature  // Make sure to destructure signature
        } = data;

        const query = `
            INSERT INTO receipts (
                id, 
                name, 
                address, 
                mobile, 
                amount, 
                accountNumber, 
                totalAmount, 
                sendDate, 
                signature
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            id,
            name,
            address,
            mobile,
            amount,
            accountNumber,
            totalAmount,
            sendDate,
            signature  // Add signature to values array
        ];

        const [result] = await pool.execute(query, values);

        if (result.affectedRows !== 1) {
            throw new Error('Failed to save receipt');
        }

        return { id, ...data };
    } catch (error) {
        console.error('Error in saveReceipt:', error);
        throw error;
    }
};

// get receipt by id
export const getReceiptById = async (id) => {
    const query = "SELECT * FROM receipts WHERE id = ?";
    const [rows] = await pool.query(query, [id]);
    return rows[0];
};