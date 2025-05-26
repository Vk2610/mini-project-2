import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, getUserByUsername, updateUserPassword } from '../model/auth.model.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Fallback for testing

// ===========================
// Register Controller
// ===========================
const registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await getUserByUsername(username);

        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const user = await createUser({ username, email, password, role });

        if (!user) {
            return res.status(500).json({ message: 'User registration failed' });
        }

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }

    
};

// ===========================
// Login Controller
// ===========================
const LoginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await getUserByUsername(username);

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role, username: user.username },
            JWT_SECRET
        );

        // Respond with the token
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'An error occurred during login' });
    }
};

// ===========================
// Reset Password Controller
// ===========================
const resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        const result = await updateUserPassword(email, newPassword);
        if (!result) {
            return res.status(400).json({ message: 'Password reset failed' });
        }
        res.status(200).json({ message: 'Password reset successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Password reset failed', error: error.message });
    }
};

// ===========================
// Get User Details Controller
// ===========================
const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserByUsername(id); // Assuming `getUserByUsername` fetches user details by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
    }
};


export { registerUser, LoginUser, resetPassword, getUserDetails};