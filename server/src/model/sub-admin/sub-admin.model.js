import pool from '../../config/db.js';
import dotenv from 'dotenv';
dotenv.config();
import { v4 as uuidv4 } from 'uuid';

// Corrected CREATE TABLE query
const createSubAdminTable = `
    CREATE TABLE IF NOT EXISTS sub_admins (
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
        fullname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NULL UNIQUE,
        branch_name VARCHAR(255) NULL UNIQUE,
        branch_region_name VARCHAR(255) NULL,
        phone_number VARCHAR(15) NULL UNIQUE
    )
`;

// Execute the CREATE TABLE query
(async () => {
    try {
        await pool.query(createSubAdminTable);
        console.log("Sub-admins table created or already exists.");
    } catch (error) {
        console.error("Error creating sub-admins table:", error);
    }
})();

// Function to create a new sub-admin
export const createSubAdmin = async (fullname, email, branch_name, branch_region_name, phone_number) => {
    try {
        const [rows] = await pool.query(
            'INSERT INTO sub_admins (fullname, email, branch_name, branch_region_name, phone_number) VALUES (?, ?, ?, ?, ?)',
            [fullname, email, branch_name, branch_region_name, phone_number]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// Function to get a sub-admin by ID
export const getSubAdminById = async (id) => {
    try {
        const [rows] = await pool.query('SELECT * FROM sub_admins WHERE id = ?', [id]);
        return rows[0]; // Return the first row (single sub-admin)
    } catch (error) {
        throw error;
    }
};

// Function to get all sub-admins
export const getAllSubAdmins = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM sub_admins');
        return rows;
    } catch (error) {
        throw error;
    }
};

// Function to update a sub-admin
export const updateSubAdmin = async (id, fullname, email, branch_name, branch_region_name, phone_number) => {
    try {
        const [rows] = await pool.query(
            'UPDATE sub_admins SET fullname = ?, email = ?, branch_name = ?, branch_region_name = ?, phone_number = ? WHERE id = ?',
            [fullname, email, branch_name, branch_region_name, phone_number, id]
        );
        return rows;
    } catch (error) {
        throw error;
    }
};

// Get Users with same branch name as sub-admin but not the sub-admin itself and users from table userProfile table and sub-admins table


export const getUsersByBranchName = async (branch_name) => {
    try {
        const query = `
            SELECT *
            FROM 
                users u
            JOIN 
                user_profile up ON u.username = up.HRMS_No
            WHERE 
                up.branch_name = ?
        `;

        // Debug logs
        console.log('Executing query:', query);
        console.log('With branch_name:', branch_name);

        const [rows] = await pool.query(query, [branch_name]);

        // Debug log
        console.log('Query results:', rows);

        return rows;
    } catch (error) {
        console.error('Error in getUsersByBranchName:', error);
        throw error;
    }
};
