import Razorpay from "razorpay";
import crypto from "crypto";
import { insertTransaction, getTransactionsByUsername, getTransactionById } from "../../model/user/payment.model.js";

const razorpay = new Razorpay({
  key_id: "rzp_test_pD29fsCUBNwO4U", // Replace with your actual test key
  key_secret: "XiNsCJ0aBrGlvwEny32B1DJz", // Keep secret on server only
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Razorpay takes amount in paisa
    currency: "INR",
    receipt: "receipt#1",
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
    console.log("Order created:", order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Order creation failed", details: err });
  }
};

// Verify Payment
export const verifyPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  console.log("razorpay_order_id:", razorpay_order_id);
  console.log("razorpay_payment_id:", razorpay_payment_id);
  console.log("razorpay_signature:", razorpay_signature);

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", "XiNsCJ0aBrGlvwEny32B1DJz") // Replace with your Razorpay Key Secret
    .update(body.toString())
    .digest("hex");

  console.log("expectedSignature:", expectedSignature);

  if (expectedSignature === razorpay_signature) {
    res.json({ message: "Payment verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid signature, payment failed" });
  }
};

// Save Payment Details
export const savePaymentDetails = async (req, res) => {
  const {
    id,
    username,
    amount,
    payment_date,
    status,
  } = req.body;

  try {
    await insertTransaction({
      id,
      username,
      amount,
      payment_date,
      status,
    });
    res.json({ message: "Payment details saved successfully" });
  } catch (error) {
    console.error("Error saving payment details:", error);
    res.status(500).json({ error: "Failed to save payment details" });
  }
};

// Get Transactions by Username
export const getTransactions = async (req, res) => {
  const { username } = req.params;

  try {
    const transactions = await getTransactionsByUsername(username);
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
};

// Get Transaction by ID
export const getSingleTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await getTransactionById(id);
    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({ error: "Transaction not found" });
    }
  }
  catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
};