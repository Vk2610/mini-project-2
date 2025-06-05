import pool from '../../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

// Function to get a sub-admin by ID
export const getSubAdminById = async (id) => {
    try {
        // Debug log for input
        console.log('Fetching sub-admin with ID:', id);

        const query = `
            SELECT 
                HRMS_No,
                Employee_Name,
                Email_ID,
                Mobile_No,
                Branch_Name,
                Branch_Region_Name,
                Designation
            FROM user_profile 
            WHERE id = ? 
            AND role = 'sub-admin'
        `;

        // Execute query
        const [rows] = await pool.query(query, [id]);

        // Debug log for results
        console.log('Query results:', {
            rowCount: rows.length,
            data: rows[0] || null
        });

        if (rows.length === 0) {
            throw new Error(`Sub-admin not found with ID: ${id}`);
        }

        return rows[0];
    } catch (error) {
        console.error('Error in getSubAdminById:', error);
        throw error;
    }
};

// Function to get all sub-admins
export const getAllSubAdmins = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM user_profile WHERE role = "sub-admin"');
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

// Function to get users by branch name
export const getUsersByBranchName = async (branch_name) => {
    try {
        const query = `
            SELECT
                id,
                HRMS_No,
                Employee_Name,
                Email_ID,
                Branch_Name,
                Branch_Region_Name,
                Mobile_No,
                role
            FROM 
                user_profile
            WHERE 
                Branch_Name = ?
                AND role = 'user'
            ORDER BY
                Employee_Name ASC
        `;

        // Debug logs
        console.log('Executing query:', query);
        console.log('With branch_name:', branch_name);

        const [rows] = await pool.query(query, [branch_name]);

        // Debug log
        console.log('Query results:', JSON.stringify(rows, null, 2));

        return rows;
    } catch (error) {
        console.error('Error in getUsersByBranchName:', error);
        throw error;
    }
};
