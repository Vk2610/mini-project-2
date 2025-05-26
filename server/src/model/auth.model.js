// import { pool } from '../config/db.js';
// import bcrypt from 'bcrypt';
// import { v4 as uuidv4 } from 'uuid';
// import dotenv from 'dotenv';
// dotenv.config();

// // Create users table if not exists
// const createUsersTable = async () => {
//   const query = `
//     CREATE TABLE IF NOT EXISTS users (
//       id CHAR(36) PRIMARY KEY,
//       username VARCHAR(255) NOT NULL,
//       email VARCHAR(255) NOT NULL UNIQUE,
//       password VARCHAR(255) NOT NULL,
//       role ENUM('admin', 'sub-admin', 'user') DEFAULT 'user',
//       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//     )
//   `;
//   await pool.query(query);
// };
// createUsersTable();

// // Save data of new user
// const createUser = async (user) => {
//   const { username, email, password, role } = user;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const id = uuidv4();
//   const query = 'INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)';
//   const values = [id, username, email, hashedPassword, role];
//   const [result] = await pool.query(query, values);


//   if (role === 'subadmin') {
//     await connection.execute(
//       'INSERT INTO sub_admins (id, name, branch, region, mobile) VALUES (?, ?, ?, ?, ?)',
//       [id, username, branch, region, mobile]
//     );
//   }

//   return result;
// };

import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

// Create users table if not exists
const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id CHAR(36) PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'sub-admin', 'user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  await pool.query(query);
};

// Save new user
const createUser = async (user) => {
  const { 
    username, 
    email,
    password, 
    role = 'user'
  } = user;

  // Validate required fields
  if (!email || !username || !password) {
    throw new Error('Username, email and password are required');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Insert into users table with all required fields
    const queryUser = `
      INSERT INTO users (id, username, email, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const valuesUser = [id, username, email, hashedPassword, role];
    await connection.query(queryUser, valuesUser);

    // If role is sub-admin, create sub_admin record with only id and username
    if (role === 'sub-admin') {
      const querySubAdmin = `
        INSERT INTO sub_admins (id, fullname,email) 
        VALUES (?, ?, ?)
      `;
      const valuesSubAdmin = [id, username];
      await connection.query(querySubAdmin, valuesSubAdmin);
    }

    await connection.commit();
    return { success: true, userId: id };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Login user by email and password
const getUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
};

// Reset password using email
const getUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Function to update the user's password
export const updateUserPassword = async (email, newPassword) => {
  if (!email || !newPassword) {
    throw new Error("Email and new password are required.");
  }

  try {
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password in the database
    const query = `UPDATE users SET password = ? WHERE email = ?`;
    const [result] = await pool.query(query, [hashedPassword, email]);

    return result.affectedRows > 0; // Return true if the password was updated
  } catch (error) {
    console.error("Error updating password:", error);
    throw new Error("Failed to update password.");
  }
};

// Reset password using email
const resetPassword = async (email, newPassword) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }
  await updateUserPassword(email, newPassword);
};

export { createUser, getUserByUsername, getUserByEmail, resetPassword };
