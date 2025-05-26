import express from 'express';
import { 
    createSubAdminController, 
    getSubAdminController, 
    updateSubAdminController, 
    getUsersByBranch 
} from '../controllers/sub-admin/sub-admin.controller.js';

const router = express.Router();

// Create a new sub-admin
router.post('/', createSubAdminController);

// Get users by branch name (move this route before /:id to prevent conflicts)
router.get('/branch/:branch_name', getUsersByBranch);

// Get a sub-admin by ID
router.get('/:id', getSubAdminController);

// Update a sub-admin by ID
router.put('/:id', updateSubAdminController);

export default router;