import { pool } from "../../config/db.js"
import dotenv from "dotenv";
dotenv.config();

// Create claimAmt table if not exists
const createClaimAmtTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS claimAmt (
    id CHAR(36) PRIMARY KEY UNIQUE, -- Use CHAR(36) for UUID
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
    signature VARCHAR(255),
    receipt VARCHAR(255),
    familyWelfareLetter VARCHAR(255),
    serviceLetter VARCHAR(255),
    bankPassbook VARCHAR(255),
    otherDocuments VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    `;
    await pool.query(query); // Removed the misplaced closing parenthesis
};

createClaimAmtTable();

// Function to insert claimAmt data into the database
export const claimAmtData = async (data) => {
    try {
        const query = `
        INSERT INTO claimAmt (
            id, hrmsNo, name, address, date, mobile,
            retirementDate, memberId, branch, amount,
            bonus, totalAmount, accountNumber, bankBranch,
            signature, receipt, serviceLetter, familyWelfareLetter,
            bankPassbook, otherDocuments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            data.id,
            data.hrmsNo,
            data.name,
            data.address,
            data.date,
            data.mobile,
            data.retirementDate,
            data.memberId,
            data.branch,
            data.amount,
            data.bonus,
            data.totalAmount,
            data.accountNumber,
            data.bankBranch,
            data.signature || null,
            data.receipt || null,
            data.serviceLetter || null,
            data.familyWelfareLetter || null,
            data.bankPassbook || null,
            data.otherDocuments || null
        ];

        const [result] = await pool.query(query, values);
        return result;

    } catch (error) {
        console.error('Error in claimAmtData:', error);
        throw error;
    }
};

// Function to get all claimAmt forms
export const getAllClaimAmtForms = async () => {
    try {
        const query = `
        SELECT * FROM claimAmt
        `;
        const [rows] = await pool.query(query);
        return rows;
    } catch (error) {
        console.error('Error in getAllClaimAmtForms:', error);
        throw error;
    }
};

// Function to get claimAmt form by ID
export const getClaimAmtFormById = async (id) => {
    try {
        const query = `
            SELECT 
                id, hrmsNo, name, address, date, mobile,
                retirementDate, memberId, branch, amount,
                bonus, totalAmount, accountNumber, bankBranch,
                signature, receipt, serviceLetter, 
                familyWelfareLetter, bankPassbook, otherDocuments
            FROM claimAmt 
            WHERE id = ?
        `;

        const [rows] = await pool.query(query, [id]);
        console.log('Database response:', rows[0]); // Debug log
        return rows[0];
    } catch (error) {
        console.error('Error in getClaimAmtFormById:', error);
        throw error;
    }
};