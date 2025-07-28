import Razorpay from "razorpay";
import crypto from "crypto";
import { addPayment, getTransactionsByHRMS_No } from "../../model/user/payment.model.js";
import moment from "moment";

const razorpay = new Razorpay({
  key_id: "rzp_test_pD29fsCUBNwO4U", // Replace with your actual test key
  key_secret: "XiNsCJ0aBrGlvwEny32B1DJz", // Keep secret on server only
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
  let { amount, receipt } = req.body;
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Invalid amount" });
  }
  amount = Number(amount);

  const options = {
    amount: amount * 100, // Razorpay takes amount in paisa
    currency: "INR",
    receipt: receipt || "receipt_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
    console.log("Order created:", order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Order creation failed" });
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


export const addPaymentDetails = async (req, res) => {
  const paymentData = {
    HRMS_No: req.body.HRMS_No,
    name: req.body.name,
    email: req.body.email,
    amount: req.body.amount,
    payment_date: moment(req.body.payment_date).format("YYYY-MM-DD HH:mm:ss"),
    transaction_id: req.body.transaction_id,
    paymentSS: req.body.paymentSS, // Assuming this is the screenshot URL
  };

  try {
    const result = await addPayment(paymentData);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error("Error adding payment:", error);
    res.status(500).json({ success: false, error: "Failed to add payment" });
  }
};

export const getPaymentDetails = async (req, res) => {
  const { HRMS_No } = req.params;

  try {
    const transactions = await getTransactionsByHRMS_No(HRMS_No);
    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for this HRMS No" });
    }
    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    res.status(500).json({ success: false, error: "Failed to fetch payment details" });
  }
}