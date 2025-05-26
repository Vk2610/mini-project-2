import express from 'express';
import { claimAmt} from '../controllers/claimAmt.controller.js';
// import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/saveClaimAmt', claimAmt);
// router.get('/claimAmt', authenticateToken, claimAmt); // Example of a protected route

export default router;