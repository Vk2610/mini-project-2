import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MdEdit,
  MdPerson,
  MdEmail,
  MdPhone,
  MdBusiness,
  MdLocationCity,
} from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BRANCHES, REGION } from "../../utils/branches";

// Add ProfileSection component
const ProfileSection = ({
  icon: Icon,
  label,
  value,
  isEditing,
  onEdit,
  children,
}) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-full">
          <Icon className="text-gray-600 text-xl" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {!isEditing && (
            <p className="text-base font-medium text-gray-800">
              {value || "-"}
            </p>
          )}
        </div>
      </div>
      {onEdit && (
        <Button
          onClick={onEdit}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-gray-800"
        >
          {isEditing ? "Done" : <MdEdit />}
        </Button>
      )}
    </div>
    {isEditing && children}
  </div>
);

const ViewSubAdmin = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFields, setEditFields] = useState({});
  const [searchTerms, setSearchTerms] = useState({
    branch: "",
    region: "",
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/sub-admin/${userId}`
        );
        setUser(response.data.data);
        console.log(response.data.data);
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
        `http://localhost:3000/sub-admin/${userId}`,
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
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                Sub-Admin Profile
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage sub-admin information
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/manage-users")}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              ← Back to Users
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <ProfileSection
            icon={MdPerson}
            label="Full Name"
            value={user?.Employee_Name}
            isEditing={editFields["Employee_Name"]}
            onEdit={() => toggleEdit("Employee_Name")}
          >
            <input
              type="text"
              value={user?.Employee_Name || ""}
              onChange={(e) => handleChange("Employee_Name", e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </ProfileSection>

          <ProfileSection
            icon={MdEmail}
            label="Email Address"
            value={user?.Email_ID}
            isEditing={editFields["Email_ID"]}
            onEdit={() => toggleEdit("Email_ID")}
          >
            <input
              type="email"
              value={user?.Email_ID || ""}
              onChange={(e) => handleChange("Email_ID", e.target.value)}
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </ProfileSection>

          <ProfileSection
            icon={MdPhone}
            label="Mobile Number"
            value={user?.Mobile_No}
            isEditing={editFields["Mobile_No"]}
            onEdit={() => toggleEdit("Mobile_No")}
          >
            <input
              type="tel"
              value={user?.Mobile_No || ""}
              onChange={(e) => handleChange("Mobile_No", e.target.value)}
              pattern="[0-9]{10}"
              maxLength="10"
              className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Enter 10 digit mobile number"
            />
          </ProfileSection>

          <ProfileSection
            icon={MdBusiness}
            label="Branch Name"
            value={user?.Branch_Name}
            isEditing={editFields["Branch_Name"]}
            onEdit={() => toggleEdit("Branch_Name")}
          >
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search branch..."
                value={searchTerms.branch}
                onChange={(e) =>
                  setSearchTerms((prev) => ({
                    ...prev,
                    branch: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {searchTerms.branch && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {BRANCHES.filter((branch) =>
                    branch
                      .toLowerCase()
                      .includes(searchTerms.branch.toLowerCase())
                  ).map((branch) => (
                    <li
                      key={branch}
                      onClick={() => {
                        handleChange("Branch_Name", branch);
                        setSearchTerms((prev) => ({ ...prev, branch: "" }));
                        toggleEdit("Branch_Name");
                      }}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      {branch}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ProfileSection>

          <ProfileSection
            icon={MdLocationCity}
            label="Branch Region"
            value={user?.Branch_Region_Name}
            isEditing={editFields["Branch_Region_Name"]}
            onEdit={() => toggleEdit("Branch_Region_Name")}
          >
            <div className="relative mt-2">
              <input
                type="text"
                placeholder="Search region..."
                value={searchTerms.region}
                onChange={(e) =>
                  setSearchTerms((prev) => ({
                    ...prev,
                    region: e.target.value,
                  }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
              {searchTerms.region && (
                <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {REGION.filter((region) =>
                    region
                      .toLowerCase()
                      .includes(searchTerms.region.toLowerCase())
                  ).map((region) => (
                    <li
                      key={region}
                      onClick={() => {
                        handleChange("Branch_Region_Name", region);
                        setSearchTerms((prev) => ({ ...prev, region: "" }));
                        toggleEdit("Branch_Region_Name");
                      }}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                    >
                      {region}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </ProfileSection>
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-4">
            <Button
              onClick={() => navigate("/admin/manage-users")}
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              className="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
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
