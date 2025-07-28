import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { FaPlus } from "react-icons/fa";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    HRMS_No: "",
    name: "",
    email: "",
    amount: "",
    payment_date: "",
    transaction_id: "",
    paymentSS: "",
  });
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [paymentSS, setPaymentSS] = useState(""); // This will be the link from server
  const [uploading, setUploading] = useState(false);

  // Format date to local string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Fetch transactions
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const HRMS_No = decoded.HRMS_No || decoded.hrms_no || decoded.hrmsNo;

        if (!HRMS_No) {
          toast.error("HRMS No. not found in token");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/payment/getPaymentDetails/${HRMS_No}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Handle different response structures
        const transactionsData = response.data?.data || response.data || [];
        setTransactions(
          Array.isArray(transactionsData) ? transactionsData : []
        );
      } catch (error) {
        console.error("Error fetching payment history:", error);
        toast.error("Failed to load payment history");
        setTransactions([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Handle form field changes
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle screenshot file selection
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    setScreenshotFile(file);
  };

  // Simulate screenshot upload and get a link (replace with your actual upload logic)
  const uploadScreenshot = async () => {
    if (!screenshotFile) {
      toast.error("Please select a screenshot file first");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("file", screenshotFile);

    try {
      const response = await axios.post(
        "http://localhost:3000/upload-pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (response.data?.url) {
        setPaymentSS(response.data.url);
        toast.success("Screenshot uploaded!");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      toast.error("Failed to upload screenshot");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      // ...other validations...
      if (!paymentSS) {
        toast.error("Please upload the payment screenshot first");
        return;
      }
      const payload = {
        ...form,
        amount: parseFloat(form.amount),
        paymentSS,
      };
      await axios.post("http://localhost:3000/payment/addPayment", payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Payment added successfully!");
      setShowModal(false);
      setForm({
        HRMS_No: "",
        name: "",
        email: "",
        amount: "",
        payment_date: "",
        transaction_id: "",
        paymentSS: "",
      });
      setScreenshotFile(null);
      // Refresh transactions
      setLoading(true);
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const id = decoded.id;
      const response = await axios.get(
        `http://localhost:3000/payment/getPaymentDetails/${HRMS_No}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Always set as array
      setTransactions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error adding payment:", error);
      toast.error("Failed to add payment");
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <>
      <div
        className={`max-w-7xl mx-auto p-6 bg-gray-50 relative transition-all duration-200 ${
          showModal ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Transaction History
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            <FaPlus className="text-lg" />
            Add Payment
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Transaction ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    HRMS No.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.isArray(transactions) &&
                  transactions.map((transaction, index) => (
                    <tr
                      key={`${transaction.id}-${index}`}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.transaction_id}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.HRMS_No}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.Name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          ₹
                          {Number(transaction.amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(
                            transaction.payment_date
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${
                        transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No transactions found
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
              disabled={uploading}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-6 text-blue-700">
              Add New Payment
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  HRMS No.
                </label>
                <input
                  type="text"
                  name="HRMS_No"
                  value={form.HRMS_No}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Date
                </label>
                <input
                  type="datetime-local"
                  name="payment_date"
                  value={form.payment_date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  name="transaction_id"
                  value={form.transaction_id}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Payment Screenshot
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleScreenshotChange}
                  className="w-full"
                  required
                />
                {screenshotFile && !paymentSS && (
                  <button
                    type="button"
                    onClick={uploadScreenshot}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Upload Screenshot"}
                  </button>
                )}
                {paymentSS && (
                  <div className="mt-2 text-green-600 text-sm">
                    Screenshot uploaded!
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                  onClick={() => setShowModal(false)}
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  disabled={uploading}
                >
                  {uploading ? "Adding..." : "Add Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Transactions;
