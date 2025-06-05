import { pool } from "../config/db.js"
import dotenv from "dotenv";
dotenv.config();

// Create claimAmt table if not exists
const createClaimAmtTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS claimAmt (
    id CHAR(36) PRIMARY KEY, -- Use CHAR(36) for UUID
    hrmsNo VARCHAR(255),
    name VARCHAR(255),
    address VARCHAR(255),
    date DATE,
    mobile VARCHAR(15),
    retirementDate DATE,
    branch VARCHAR(255),
    memberId VARCHAR(255),
    amount VARCHAR(255),
    bonus VARCHAR(255),
    totalAmount VARCHAR(255),
    accountNumber VARCHAR(255),
    bankBranch VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    `;
    await pool.query(query); // Removed the misplaced closing parenthesis
};

createClaimAmtTable();

// Function to insert claimAmt data into the database
export const claimAmtData = async (data) => {
    const { hrmsNo, name, address, date, mobile, retirementDate, branch, memberId, amount, bonus, totalAmount, accountNumber, bankBranch } = data;
    const id = data.id;
    const query = `
        INSERT INTO claimAmt (id, hrmsNo, name, address, date, mobile, retirementDate, branch, memberId, amount, bonus, totalAmount, accountNumber, bankBranch)
        VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id, hrmsNo, name, address, date, mobile, retirementDate, branch, memberId, amount, bonus, totalAmount, accountNumber, bankBranch];
    const [result] = await pool.query(query, values);
    return result;
};