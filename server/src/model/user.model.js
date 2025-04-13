import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//  create users table if not exists
const createUsersTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
    await pool.query(query);
};
createUsersTable();

// save data of new user
const createUser = async (user) => {
    const { username, email, password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    const values = [username, email, hashedPassword];
    const [result] = await pool.query(query, values);
    return result;
};

// login user by email and password
const getUserByUsername = async (username) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};
// reset password using email
const getUserByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

// UPDATE USER PASSWORD USING EMAIL
const updateUserPassword = async (email, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE users SET password = ? WHERE email = ?';
    const values = [hashedPassword, email];
    const [result] = await pool.query(query, values);
    return result;
};

export { createUser, getUserByUsername, updateUserPassword, getUserByEmail };
