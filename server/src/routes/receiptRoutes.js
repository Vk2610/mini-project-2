import express from 'express';
import { createReceipt, getReceipt, checkReceipt } from '../controllers/receipt.controller.js';
// import authenticateToken from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to create a receipt
router.post('/createReceipt', createReceipt);

// Route to get a receipt by ID
router.get('/getReceipt/:id',getReceipt);

// Route to check if a receipt is already created
router.get('/checkReceipt/:id', checkReceipt);

export default router;