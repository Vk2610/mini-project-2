import express from 'express';
import { saveFormData, getForm } from '../controllers/form.controller.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Route to save form data
router.post('/saveFormData', saveFormData);

// Route to get form data by ID
router.get('/getForm/:id', authenticateToken, getForm);

export default router;