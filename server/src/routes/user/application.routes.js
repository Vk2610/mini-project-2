import express from "express";
import { saveApplicationForm, checkFormSubmitted, getFormData } from "../../controllers/user/application.controller.js";

const router = express.Router();    

router.post('/saveApplicationForm', saveApplicationForm);
router.get('/getFormData/:id', getFormData); // Get form data by ID

router.get('/checkFormSubmitted/:id', checkFormSubmitted);


export default router;