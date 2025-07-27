import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  MdEdit,
  MdPerson,
  MdEmail,
  MdPhone,
  MdBadge,
  MdSave,
  MdClose,
} from "react-icons/md";
import { jwtDecode } from "jwt-decode";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({
    Mobile_No: false,
    Email_ID: false,
  });
  const [editedValues, setEditedValues] = useState({
    Mobile_No: "",
    Email_ID: "",
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSubAdmins: 0,
    totalBranches: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const id = decoded.id;

      try {
        // Fetch admin profile
        const profileResponse = await axios.get(
          `http://localhost:3000/admin/profile/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Fetch all stats in parallel
        const [usersCount, subAdminsCount, branchesCount] = await Promise.all([
          axios.get("http://localhost:3000/stats/users/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/stats/sub-admins/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:3000/stats/branches/count", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setAdmin(profileResponse.data);
        setStats({
          totalUsers: usersCount.data.userCount,
          totalSubAdmins: subAdminsCount.data.subAdminCount,
          totalBranches: branchesCount.data.branchCount,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (field) => {
    setEditing((prev) => ({ ...prev, [field]: true }));
    setEditedValues((prev) => ({ ...prev, [field]: admin[field] || "" }));
  };

  const handleCancel = (field) => {
    setEditing((prev) => ({ ...prev, [field]: false }));
    setEditedValues((prev) => ({ ...prev, [field]: admin[field] || "" }));
  };

  const handleSave = async (field) => {
    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const id = decoded.id;

      const response = await axios.put(
        `http://localhost:3000/admin/profile/${id}`,
        { [field]: editedValues[field] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAdmin((prev) => ({ ...prev, [field]: editedValues[field] }));
        setEditing((prev) => ({ ...prev, [field]: false }));
        toast.success(
          `${
            field === "Email_ID" ? "Email" : "Mobile number"
          } updated successfully!`
        );
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast.error(
        `Failed to update ${field === "Email_ID" ? "email" : "mobile number"}`
      );
    }
  };

  const ProfileSection = ({ icon: Icon, label, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-50 rounded-full">
          <Icon className="text-blue-500 text-xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-lg font-semibold text-gray-800">{value || "-"}</p>
        </div>
      </div>
    </div>
  );

  const EditableProfileSection = ({ icon: Icon, label, field, value }) => (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col w-full">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-full">
              <Icon className="text-blue-500 text-xl" />
            </div>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
          <div className="flex gap-2">
            {editing[field] ? (
              <>
                <button
                  onClick={() => handleSave(field)}
                  className="p-2 text-green-500 hover:text-green-600"
                  title="Save"
                >
                  <MdSave />
                </button>
                <button
                  onClick={() => handleCancel(field)}
                  className="p-2 text-red-500 hover:text-red-600"
                  title="Cancel"
                >
                  <MdClose />
                </button>
              </>
            ) : (
              <button
                onClick={() => handleEdit(field)}
                className="p-2 text-blue-500 hover:text-blue-600"
                title="Edit"
              >
                <MdEdit />
              </button>
            )}
          </div>
        </div>
        <div className="w-full">
          {editing[field] ? (
            <input
              type={field === "Email_ID" ? "email" : "text"}
              value={editedValues[field]}
              onChange={(e) =>
                setEditedValues((prev) => ({
                  ...prev,
                  [field]: e.target.value,
                }))
              }
              autoFocus
              onBlur={() => {
                if (editedValues[field] === admin[field]) {
                  handleCancel(field);
                }
              }}
              className={`w-full text-lg font-semibold text-gray-800 border-b ${
                field === "Email_ID" ? "break-all" : ""
              } border-blue-500 focus:outline-none px-2 py-1`}
              style={{
                minWidth: "200px",
                maxWidth: "100%",
                wordBreak: field === "Email_ID" ? "break-all" : "normal",
              }}
            />
          ) : (
            <p
              className={`text-lg font-semibold text-gray-800 ${
                field === "Email_ID" ? "break-all" : ""
              }`}
            >
              {value || "-"}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        No admin data found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50">
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-blue-100 mt-2">System Administrator Profile</p>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProfileSection
                icon={MdPerson}
                label="Username"
                value={admin.HRMS_No}
              />
              <ProfileSection
                icon={MdBadge}
                label="Role"
                value={admin.role?.toUpperCase()}
              />
              <EditableProfileSection
                icon={MdPhone}
                label="Phone Number"
                field="Mobile_No"
                value={admin.Mobile_No}
              />
              <EditableProfileSection
                icon={MdEmail}
                label="Email Address"
                field="Email_ID"
                value={admin.Email_ID}
              />
            </div>

            {/* Stats Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">Total Users</h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">
                  Active Sub-Admins
                </h3>
                <p className="text-3xl font-bold">{stats.totalSubAdmins}</p>
              </div>
              <div className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-lg text-white">
                <h3 className="text-lg font-semibold mb-2">Total Branches</h3>
                <p className="text-3xl font-bold">{stats.totalBranches}</p>
              </div>
            </div>

            {/* Activity Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Recent Activity
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  Last login:{" "}
                  {new Date(admin.lastLogin || Date.now()).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminProfile;
