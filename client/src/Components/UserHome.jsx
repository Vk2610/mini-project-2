import React from "react";
import { Link } from "react-router-dom";
import { FaWpforms, FaFileInvoice, FaHistory, FaCheckCircle } from "react-icons/fa";

const UserHome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center py-12">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/logo192.png"
            alt="Rayat Sevak Logo"
            className="h-20 w-20 mb-3 drop-shadow-lg"
          />
          <h1 className="text-4xl font-extrabold text-blue-800 mb-2 tracking-tight">
            Rayat Sevak User Dashboard
          </h1>
          <p className="text-gray-600 text-lg text-center max-w-xl">
            Welcome! Here you can manage your application, payments, and receipts with ease.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/form"
            className="group bg-white rounded-2xl shadow-lg p-7 flex items-center transition hover:scale-105 hover:shadow-2xl border-t-4 border-blue-400"
          >
            <div className="bg-blue-100 p-4 rounded-full mr-6">
              <FaWpforms className="text-blue-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-700 group-hover:underline">
                Apply / View Application
              </h2>
              <p className="text-gray-500 mt-1">
                Start a new application or check your current application status.
              </p>
            </div>
          </Link>
          <Link
            to="/receipts"
            className="group bg-white rounded-2xl shadow-lg p-7 flex items-center transition hover:scale-105 hover:shadow-2xl border-t-4 border-green-400"
          >
            <div className="bg-green-100 p-4 rounded-full mr-6">
              <FaFileInvoice className="text-green-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-700 group-hover:underline">
                View Receipts
              </h2>
              <p className="text-gray-500 mt-1">
                Access and download your payment receipts anytime.
              </p>
            </div>
          </Link>
          <Link
            to="/payment-history"
            className="group bg-white rounded-2xl shadow-lg p-7 flex items-center transition hover:scale-105 hover:shadow-2xl border-t-4 border-yellow-400"
          >
            <div className="bg-yellow-100 p-4 rounded-full mr-6">
              <FaHistory className="text-yellow-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-yellow-700 group-hover:underline">
                Payment History
              </h2>
              <p className="text-gray-500 mt-1">
                Review all your past payments and transactions.
              </p>
            </div>
          </Link>
          <Link
            to="/status"
            className="group bg-white rounded-2xl shadow-lg p-7 flex items-center transition hover:scale-105 hover:shadow-2xl border-t-4 border-purple-400"
          >
            <div className="bg-purple-100 p-4 rounded-full mr-6">
              <FaCheckCircle className="text-purple-600 text-3xl" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-700 group-hover:underline">
                Application Status
              </h2>
              <p className="text-gray-500 mt-1">
                Track the approval or rejection of your application.
              </p>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} Rayat Sevak Portal &mdash; Empowering Users
        </div>
      </div>
    </div>
  );
};

export default UserHome;