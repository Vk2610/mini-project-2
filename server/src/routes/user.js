import express from 'express';
import { registerUser, LoginUser, resetPassword, updatePassword } from '../controllers/user.controller.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/resetPassword', resetPassword); 
router.post('/updatePassword', authenticateToken, updatePassword);

// Example protected route
router.get('/dashboard', authenticateToken, (req, res) => {
    res.json({ message: 'Welcome to the dashboard!', user: req.user });
});

export default router;
