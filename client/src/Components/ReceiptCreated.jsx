import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ReceiptDetailsPage = () => {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReceiptDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication required");
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(
          `http://localhost:3000/receipt/getReceipt/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Check if the receipt belongs to the current user
        if (response.data) {
          setReceipt(response.data);
        } else {
          throw new Error("Receipt not found");
        }
      } catch (err) {
        console.error("Error fetching receipt:", err);
        setError(err.message);
        toast.error("Failed to load receipt details");
      } finally {
        setLoading(false);
      }
    };

    fetchReceiptDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl font-semibold mb-2">Error</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Receipt not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Receipt Details</h1>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Go Back
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Receipt ID</p>
                <p className="text-sm font-medium">{receipt.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">HRMS No</p>
                <p className="text-sm font-medium">{receipt.HRMS_No}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-sm font-medium">
                  ₹{Number(receipt.amount).toLocaleString("en-IN")}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                  ${
                    receipt.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-gray-500">Payment Date</p>
              <p className="text-sm font-medium">
                {new Date(receipt.payment_date).toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetailsPage;
