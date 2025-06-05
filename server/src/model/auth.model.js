import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();



// Save new user
export const createUser = async (userData) => {
  const {
    HRMS_No,
    Email_ID,
    Branch_Name,
    Branch_Region_Name,
    Mobile_No,
    password,
    role = 'user'
  } = userData;

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const userId = uuidv4(); // Generate UUID

    // Check for existing user with exact case matching
    const [existingUser] = await connection.query(
      'SELECT HRMS_No FROM user_profile WHERE BINARY HRMS_No = ? OR BINARY Email_ID = ?',
      [HRMS_No, Email_ID]
    );

    if (existingUser.length > 0) {
      throw new Error('User already exists with this HRMS No or Email');
    }

    // Check for sub-admin with exact branch name matching
    if (role === 'sub-admin') {
      const [existingSubAdmin] = await connection.query(
        'SELECT HRMS_No FROM user_profile WHERE BINARY Branch_Name = ? AND role = ?',
        [Branch_Name, 'sub-admin']
      );

      if (existingSubAdmin.length > 0) {
        throw new Error(`Sub-admin already exists for branch ${Branch_Name}`);
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with UUID
    const query = `
      INSERT INTO user_profile (
        id,
        HRMS_No,
        Email_ID,
        Branch_Name,
        Branch_Region_Name,
        Mobile_No,
        password,
        role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      userId,
      HRMS_No,
      Email_ID,
      Branch_Name,
      Branch_Region_Name,
      Mobile_No,
      hashedPassword,
      role
    ];

    await connection.query(query, values);
    await connection.commit();
    return { success: true, HRMS_No, userId };

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;

  } finally {
    if (connection) {
      connection.release();
    }
  }
};

export const getUserByUsername = async (username) => {
  const query = `
    SELECT * FROM user_profile
    WHERE HRMS_No = ?
  `;
  const [result] = await pool.query(query, [username]);
  if (result.length === 0) {
    throw new Error("User not found");
  }
  return result[0];
}

export const getUserById = async (id) => {
  const query = `
    SELECT * FROM user_profile
    WHERE id = ?
  `;
  const [result] = await pool.query(query, [id]);
  if (result.length === 0) {
    throw new Error("User not found");
  }
  return result[0];
}

// reset userpassword by email
export const resetUserPassword = async (email, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const query = `
    UPDATE user_profile
    SET password = ?
    WHERE Email_ID = ?
  `;
  const [result] = await pool.query(query, [hashedPassword, email]);

  if (result.affectedRows === 0) {
    throw new Error("User not found or password update failed");
  }

  return { success: true };
}


