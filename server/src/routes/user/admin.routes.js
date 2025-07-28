import express from 'express';
import { getAllSubAdminsController, getSubadminById, editSubAdminController } from '../../controllers/admin/admin.controller.js';
import { send_ApplicationForm } from '../../config/Handle_email.js';

const router = express.Router();

// Route to get all sub-admins
router.get('/', getAllSubAdminsController);

// Route to get a sub-admin by ID
router.get('/:id', getSubadminById);

// Route to edit a sub-admin by ID
router.put('/:id', editSubAdminController);

// Add to your admin routes file
router.post('/applications/:id/send-mail', async (req, res) => {
    try {
        const { email, name, memberNo, formData } = req.body;
        await send_ApplicationForm(email, name, memberNo, formData);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;