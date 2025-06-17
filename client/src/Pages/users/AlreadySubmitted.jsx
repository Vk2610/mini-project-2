import React, { useState, useEffect } from "react";
import ViewForm from "../../Components/ViewForm";
import { Button } from "@/components/ui/button";
import { IoArrowBack } from "react-icons/io5";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AlreadySubmitted = () => {
  const [showViewForm, setShowViewForm] = useState(false);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        if (!userId) {
          throw new Error("User ID not found");
        }

        const response = await axios.get(
          `http://localhost:3000/user/getFormData/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Check if response.data exists and contains the application data
        if (response.data && response.data) {
          setApplication(response.data);
          console.log("Application data:", response.data);
        } else {
          throw new Error("Application data not found in response");
        }
      } catch (error) {
        console.error("Error fetching application:", error);
        setError(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600 text-center">
          <p className="text-xl font-semibold">Error loading application</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {!showViewForm ? (
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">
              You have already submitted this form
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700">
              Track your application progress
            </h2>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    HRMS NO.
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Application Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Remarks
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {application?.hrmsNo || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        application?.Status === "approved"
                          ? "bg-green-100 text-green-800"
                          : application?.Status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {application?.Status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {application?.remarks || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() => setShowViewForm(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      View Form
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowViewForm(false)}
            className="top-4 z-50 bg-gray-600 text-white hover:bg-gray-700 transition rounded-lg px-4 py-2 flex items-center gap-2"
          >
            <IoArrowBack size={20} />
            <span>Go Back</span>
          </button>
          <div className="mt-4">
            <ViewForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default AlreadySubmitted;
