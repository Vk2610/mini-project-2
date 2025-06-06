import { pool } from '../config/db.js';

export const getUserCount = async () => {
    try {
        const query = "SELECT COUNT(*) AS userCount FROM user_profile WHERE role = 'user'";
        const [rows] = await pool.query(query);
        return rows[0].userCount;
    } catch (error) {
        console.error('Error in getUserCount:', error);
        throw error;
    }
};

export const getSubAdminCount = async () => {
    try {
        const query = "SELECT COUNT(*) AS subAdminCount FROM user_profile WHERE role = 'sub-admin'";
        const [rows] = await pool.query(query);
        return rows[0].subAdminCount;
    } catch (error) {
        console.error('Error in getSubAdminCount:', error);
        throw error;
    }
};

export const getBranchCount = async () => {
    try {
        const query = "SELECT COUNT(DISTINCT Branch_Name) AS branchCount FROM user_profile WHERE role = 'sub-admin'";
        const [rows] = await pool.query(query);
        return rows[0].branchCount;
    } catch (error) {
        console.error('Error in getBranchCount:', error);
        throw error;
    }
};