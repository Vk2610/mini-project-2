import express from 'express';
import { 
    getAdminProfileController, 
    getAllSubAdminsController, 
    getSubadminById, 
    editSubAdminController,
    updateAdminProfileController, // Changed from updateAdmin
    getApplicationsController,
    getApplicationByIdController,
    updateApplicationStatusController
} from '../controllers/admin/admin.controller.js';

const router = express.Router();



// Get admin profile
router.get('/profile/:id', getAdminProfileController);
// Update admin profile
router.put('/profile/:id', updateAdminProfileController); // Changed from updateAdmin
// Get all sub-admins
router.get('/sub-admins', getAllSubAdminsController);
// Get sub-admin by ID
router.get('/sub-admin/:id', getSubadminById);

// Get applications
router.get('/applications', getApplicationsController);
router.get('/applications/:id', getApplicationByIdController); // Assuming this is for a specific application
// Edit sub-admin
router.put('/sub-admin/:id', editSubAdminController);
// Update application status
router.put('/applications/:id/status', updateApplicationStatusController);

export default router;