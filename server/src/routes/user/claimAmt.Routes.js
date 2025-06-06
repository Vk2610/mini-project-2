import express from 'express';
import { claimAmt, getAllClaimAmt, getClaimAmtById } from '../../controllers/user/claimAmt.controller.js';
// import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/saveClaimAmt', claimAmt);
// router.get('/claimAmt', authenticateToken, claimAmt); // Example of a protected route
router.get('/getClaimAmtForm', getAllClaimAmt); // Example of a public route
router.get('/getClaimAmtForm/:id', getClaimAmtById); // Example of a route with a parameter

export default router;