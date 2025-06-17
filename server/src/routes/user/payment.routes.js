import express from "express";
import {
  createOrder,
  verifyPayment,
  savePaymentDetails,
  getTransactions,
  getSingleTransaction,
  ManualSavePaymentController,
} from "../../controllers/user/payment.controller.js";

const router = express.Router();

// Route to create a Razorpay order
router.post("/create-order", createOrder);

// Route to verify Razorpay payment
router.post("/verify", verifyPayment);

// Route to save payment details
router.post("/save-payment", savePaymentDetails);

// Route to get all transactions by username
router.get("/transactions/:username", getTransactions);

// Route to get a single transaction by ID
router.get("/transaction/:id", getSingleTransaction);

// Route to manually save payment details
router.post("/manual-save-payment", ManualSavePaymentController);

export default router;