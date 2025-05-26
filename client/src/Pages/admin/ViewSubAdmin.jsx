import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BRANCHES, REGION } from "../../utils/branches";

const ViewSubAdmin = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/admin/${userId}`
        );
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user details");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = (key, value) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEdit = (field) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleKeyPress = (e, field) => {
    if (e.key === "Enter") {
      toggleEdit(field);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin/${userId}`,
        user
      );
      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setEditFields({});
      }
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    }
  };

  // Reusable field component
  const ProfileField = ({ label, field, type = "text" }) => (
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <label className="text-gray-700 font-semibold w-1/5">{label}:</label>
      <div className="w-3/5 flex items-center">
        {editFields[field] ? (
          <input
            type={type}
            value={user[field] || ""}
            onChange={(e) => handleChange(field, e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, field)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            autoFocus
          />
        ) : (
          <span className="px-4 py-2">{user[field] || "-"}</span>
        )}
      </div>
      <Button
        onClick={() => toggleEdit(field)}
        className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
        size="sm"
      >
        {editFields[field] ? "Done" : <MdEdit />}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error)
    return (
      <div className="p-6 text-red-500 text-center font-semibold">{error}</div>
    );
  if (!user)
    return (
      <div className="p-6 text-gray-500 text-center font-semibold">
        User not found
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl transition-all duration-300 hover:shadow-lg">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Sub-Admin Details
            </h2>
            <button
              onClick={() => navigate("/admin/manage-users")}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
            >
              <span>←</span> Back to Users
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <ProfileField label="Full Name" field="fullname" />
            <ProfileField label="Email" field="email" />
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <label className="text-gray-700 font-semibold w-1/5">
                Branch Name:
              </label>
              <div className="w-3/5 flex items-center">
                {editFields["branch_name"] ? (
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search or Select Branch Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, "branch_name")}
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                    />
                    {searchTerm && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                        {BRANCHES.filter((branch) =>
                          branch.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((branch) => (
                          <li
                            key={branch}
                            onClick={() => {
                              handleChange("branch_name", branch);
                              setSearchTerm("");
                              toggleEdit("branch_name");
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {branch}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <span className="px-4 py-2">{user.branch_name || "-"}</span>
                )}
              </div>
              <Button
                onClick={() => toggleEdit("branch_name")}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
                size="sm"
              >
                {editFields["branch_name"] ? "Done" : <MdEdit />}
              </Button>
            </div>

            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <label className="text-gray-700 font-semibold w-1/5">
                Branch Region:
              </label>
              <div className="w-3/5 flex items-center">
                {editFields["branch_region_name"] ? (
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search or Select Branch Region"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, "branch_region_name")}
                      className="w-full border border-gray-300 rounded-md px-4 py-2"
                    />
                    {searchTerm && (
                      <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                        {REGION.filter((region) =>
                          region.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((region) => (
                          <li
                            key={region}
                            onClick={() => {
                              handleChange("branch_region_name", region);
                              setSearchTerm("");
                              toggleEdit("branch_region_name");
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {region}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <span className="px-4 py-2">
                    {user.branch_region_name || "-"}
                  </span>
                )}
              </div>
              <Button
                onClick={() => toggleEdit("branch_region_name")}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
                size="sm"
              >
                {editFields["branch_region_name"] ? "Done" : <MdEdit />}
              </Button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <Button
              onClick={() => navigate("/admin/manage-users")}
              className="px-6 py-3 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ViewSubAdmin;
