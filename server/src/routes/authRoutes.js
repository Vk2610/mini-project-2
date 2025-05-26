import express from 'express';
import { registerUser, LoginUser, resetPassword,} from '../controllers/auth.controller.js';
import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', LoginUser);
router.post('/resetPassword', resetPassword);
// router.post('/updatePassword',authenticateToken, updatePassword);

// router.get('/:id', authenticateToken, getUserDetails);
// router.put('/updatePassword', authenticateToken, updatePassword);


export default router;
