import express from "express";
import {
  createOrder,
    verifyPayment,
    addPaymentDetails,
    getPaymentDetails
} from "../../controllers/user/payment.controller.js";

const router = express.Router();

// Route to create a Razorpay order
router.post("/create-order", createOrder);

// Route to verify Razorpay payment
router.post("/verify", verifyPayment);

// Add payment by screenshot
router.post("/addPayment", addPaymentDetails);

// Get payment details by HRMS_No
router.get("/getPaymentDetails/:HRMS_No", getPaymentDetails);
export default router;