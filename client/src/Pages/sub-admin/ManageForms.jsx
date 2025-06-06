import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ManageForms = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); // New state for search
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login again");
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const id = decodedToken.id; // Assuming this is sub-admin's HRMS number or ID

        // Fetch sub-admin profile to get branch
        const { data: subAdminData } = await axios.get(
          `http://localhost:3000/sub-admin/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // console.log("Sub-admin data:", subAdminData);

        const branch = subAdminData.data?.Branch_Name;
        if (!branch) {
          throw new Error("Branch information not found in sub-admin profile");
        }

        // Fetch applications for that branch
        const { data: applicationsData } = await axios.get(
          `http://localhost:3000/sub-admin/branch/${branch}/forms`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (applicationsData?.success) {
          setApplications(applicationsData.applicationForms || []);
          setTotalItems(applicationsData.total || 0);
        } else {
          throw new Error("Failed to fetch applications");
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error(
          error?.response?.data?.message ||
            error.message ||
            "Failed to load applications"
        );
        setApplications([]);
        setTotalItems(0);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Update the filterApplications function to include search
  const filterApplications = (items) => {
    return items.filter((item) => {
      const matchesStatus =
        statusFilter === "all" || item.Status?.toLowerCase() === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        );
      return matchesStatus && matchesSearch;
    });
  };

  // Pagination logic
  const filteredItems = filterApplications(applications);
  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const totalPages = Math.ceil((filteredItems?.length || 0) / PAGE_SIZE);
  const currentItems = filteredItems?.slice(startIndex, endIndex) || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Application Forms</h1>
        <div className="flex items-center gap-4">
          {/* Add search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset to first page when searching
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Existing status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Add status count summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total Forms</p>
          <p className="text-2xl font-semibold">{applications.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-semibold">
            {applications.filter((app) => app.Status === "pending").length}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-sm text-green-600">Approved</p>
          <p className="text-2xl font-semibold">
            {applications.filter((app) => app.Status === "approved").length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <p className="text-sm text-red-600">Rejected</p>
          <p className="text-2xl font-semibold">
            {applications.filter((app) => app.Status === "rejected").length}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                HRMS No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((application) => (
              <tr key={application.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.hrmsNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.memberNo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {application.designation}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      application.Status === "approved"
                        ? "bg-green-100 text-green-800"
                        : application.Status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {application.Status?.charAt(0).toUpperCase() +
                      application.Status?.slice(1) || "N/A"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => {
                      /* Add view handler */
                    //   Open another page or modal to view application details
                      console.log("View application:", application.id);
                      // You can implement a modal or redirect to a detailed view page
                      navigate(`/sub-admin/view-application/${application.id}`);
                    }}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <FaEye className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update empty state handling */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            {searchTerm
              ? `No applications found matching "${searchTerm}"`
              : `No ${
                  statusFilter !== "all" ? statusFilter : ""
                } applications found`}
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {page} of {totalPages || 1}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages || totalPages === 0}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ManageForms;
