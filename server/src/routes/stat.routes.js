import express from 'express';
import { 
    getCountOfUsers, 
    getCountOfSubAdmins, 
    getCountOfBranches 
} from '../controllers/stat.controller.js';

const router = express.Router();

// Statistics routes
router.get('/users/count', getCountOfUsers);
router.get('/sub-admins/count', getCountOfSubAdmins);
router.get('/branches/count', getCountOfBranches);

export default router;