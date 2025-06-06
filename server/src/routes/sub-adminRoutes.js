import express from 'express';
import { 
    getSubAdminController, 
    updateSubAdminController, 
    getUsersByBranch,
    getApplicationFormsByBranch,
    updateApplicationFormStatusController
} from '../controllers/sub-admin/sub-admin.controller.js';
// import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();


// Get users by branch name (move this route before /:id to prevent conflicts)
router.get('/branch/:branch_name', getUsersByBranch);
router.get('/branch/:branch_name/forms', getApplicationFormsByBranch);

// Get a sub-admin by ID
router.get('/:id', getSubAdminController);

// Update a sub-admin by ID
router.put('/:id', updateSubAdminController);
// Update application form status
router.put('/application-form/:id/status', updateApplicationFormStatusController);

export default router;