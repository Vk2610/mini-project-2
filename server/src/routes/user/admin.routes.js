import express from 'express';
import { getAllSubAdminsController, getSubadminById, editSubAdminController } from '../../controllers/admin/admin.controller.js';
import e from 'express';

const router = express.Router();

// Route to get all sub-admins
router.get('/', getAllSubAdminsController);

// Route to get a sub-admin by ID
router.get('/:id',getSubadminById);

// Route to edit a sub-admin by ID
router.put('/:id', editSubAdminController);

export default router;