import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ShowReceipt = () => {
  const { id } = useParams(); // Get the receipt ID from the URL
  const navigate = useNavigate();
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Receipt ID:", id); // Debugging: Check if `id` is undefined

    const fetchReceiptData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/receipt/getReceipt/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch receipt data");
        }
        const data = await response.json();
        setReceiptData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReceiptData();
    } else {
      setError("Invalid receipt ID");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/user")} // Go back to the previous page
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!receiptData) {
    return (
      <div className="text-center mt-10">
        <p>No Receipt Data Found</p>
        <button
          onClick={() => navigate("/user")} // Go back to the previous page
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4 justify-center"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-10 border xl shadow">
      <h1 className="text-center text-xl font-bold mb-4">Receipt Details</h1>
      <div className="space-y-4">
        <p>
          <strong>Name:</strong> {receiptData.name}
        </p>
        <p>
          <strong>Address:</strong> {receiptData.address}
        </p>
        <p>
          <strong>Mobile:</strong> {receiptData.mobile}
        </p>
        <p>
          <strong>Amount:</strong> ₹{receiptData.amount}
        </p>
        <p>
          <strong>Account Number:</strong> {receiptData.accountNumber}
        </p>
        <p>
          <strong>Total Amount:</strong> ₹{receiptData.totalAmount}
        </p>
        <p>
          <strong>Date:</strong> {receiptData.sendDate}
        </p>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate("/user")} // Go back to the previous page
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ShowReceipt;
