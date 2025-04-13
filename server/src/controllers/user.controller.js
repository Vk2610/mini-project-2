import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByUsername, updateUserPassword, getUserByEmail } from '../model/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // for testing fallback

// ===========================
// Register Controller
// ===========================
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await getUserByUsername(username);

        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const user = await createUser({ username, email, password });

        if (!user) {
            return res.status(500).json({ message: 'User registration failed' });
        }

        const token = jwt.sign({ username, email }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
};

// ===========================
// Login Controller
// ===========================
const LoginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ username: user.username, email: user.email }, JWT_SECRET);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
};

// reset password 
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        const result = await updateUserPassword(email, newPassword, confirmPassword);
        if (!result) {
            return res.status(400).json({ message: 'Password reset failed' });
        }
        res.status(200).json({ message: 'Password reset successfully', result });
    }
    catch (error) {
        res.status(500).json({ message: 'Password reset failed', error: error.message });
    }
}

// update password using email
const updatePassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const result = await updateUserPassword(email, newPassword);
        res.status(200).json({ message: 'Password updated successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Password update failed', error: error.message });
    }
}


export { registerUser, LoginUser, resetPassword, updatePassword };