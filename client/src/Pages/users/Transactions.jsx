import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Correct import

const Transactions = () => {
  const [transactions, setTransactions] = useState([]); // State to store transactions
  const [loading, setLoading] = useState(true); // State to handle loading

  // Fetch transactions from the backend
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the token from local storage
        if (!token) return; // If no token, exit the function
        const decoded = jwtDecode(token); // Decode the token to get user info  
        const username = decoded.username;
        const response = await axios.get(`http://localhost:3000/payment/transactions/${username}`); // Replace with your backend endpoint
        setTransactions(response.data); // Set the fetched transactions
        setLoading(false); // Stop loading
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading transactions...</div>;
  }

  return (
    <div className="relative overflow-x-auto max-w-6xl m-auto mt-10 shadow-md">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-300">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-500 dark:text-gray-300">
          <tr>
            <th scope="col" className="px-6 py-3">
              Transaction ID
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Amount
            </th>
            <th scope="col" className="px-6 py-3">
              Payment Date
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-500 border-gray-200"
            >
              <td className="px-6 py-4">{transaction.id}</td>
              <td className="px-6 py-4">{transaction.username}</td>
              <td className="px-6 py-4">₹{transaction.amount}</td>
              <td className="px-6 py-4">{new Date(transaction.payment_date).toLocaleString()}</td>
              <td className="px-6 py-4 text-green-500 capitalize">{transaction.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
