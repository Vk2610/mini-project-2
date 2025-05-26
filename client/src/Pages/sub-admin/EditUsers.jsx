import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import {
  BRANCHES,
  DESIGNATIONS,
  REGION,
  BRANCH_TYPE,
  QUALIFICATIONS,
} from "../../utils/branches";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useNavigate } from "react-router-dom";

const EditUsers = () => {
  const { userId } = useParams(); // Get userId from URL params
  const navigate = useNavigate();
  const [user, setUser] = useState({
    HRMS_No: "",
    Employee_Name: "",
    Email_ID: "", // <-- Use Email_ID instead of email
    Gender: "",
    Mobile_No: "",
    Branch_Name: "",
    Branch_Region_Name: "",
    Designation: "",
    Branch_Type: "",
    Qualifications: "", // Make this a string, not an array
    // Add other fields as needed
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [editFields, setEditFields] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomQualification, setShowCustomQualification] = useState(false);
  const filteredDesignations = DESIGNATIONS.filter((designation) =>
    designation.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBranch_Namees = BRANCHES.filter((branch) =>
    branch.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredBranchTypes = BRANCH_TYPE.filter((branchType) =>
    branchType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setMessage("User not logged in.");
          setMessageType("error");
          return;
        }

        // Use the correct API endpoint
        const response = await axios.get(
          `http://localhost:3000/profile/${userId}`, // Using profile endpoint
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUser(response.data.result || {});
        setMessage("");
      } catch (error) {
        console.error("Error fetching user:", error);
        if (error.response?.status === 401) {
          setMessage("Unauthorized. Please log in again.");
          setMessageType("error");
        } else {
          setMessage("Failed to load user details.");
          setMessageType("error");
        }
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // Handle input changes
  const handleChange = (key, value) => {
    setUser((prevUser) => ({ ...prevUser, [key]: value }));
  };

  // Toggle edit state for a specific field
  const toggleEdit = (field) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle key press for inputs
  const handleKeyPress = (e, field) => {
    if (e.key === "Enter") {
      toggleEdit(field);
    }
  };

  // Update user profile
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("User not logged in.");
        return;
      }

      // Use the same profile endpoint for updates
      const response = await axios.put(
        `http://localhost:3000/profile/${userId}`,
        user,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("Profile updated successfully!");
        setEditFields({}); // Reset edit fields after successful update
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  // Field component to avoid repetition
  const ProfileField = ({ label, field, type = "text" }) => (
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <label className="text-gray-700 font-semibold w-1/5">{label}:</label>
      <div className="w-3/5 flex items-center">
        {editFields[field] ? (
          <input
            type={type}
            value={
              type === "date" && user[field]
                ? new Date(user[field]).toISOString().split("T")[0] // Format date as YYYY-MM-DD
                : user[field] || ""
            }
            onChange={(e) => handleChange(field, e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, field)}
            className="w-full border border-gray-300 rounded-md px-4 py-2"
            autoFocus
          />
        ) : (
          <span className="px-4 py-2">
            {type === "date" && user[field]
              ? new Date(user[field]).toISOString().split("T")[0] // Format date as YYYY-MM-DD
              : user[field] || "-"}
          </span>
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

  return (
    <div className="max-w-6xl mx-auto my-10 p-8 border border-gray-300 shadow-md bg-white">
      <h2 className="text-3xl font-semibold mb-6 p-4 bg-blue-50">User Details</h2>

      <div className="space-y-2">
        <ProfileField label="HRMS NO" field="HRMS_No" type="text" />
        <ProfileField label="Name" field="Employee_Name" type="text" />
        <ProfileField label="Email ID" field="Email_ID" type="email" />

        {/* Add more fields as needed */}
        {/* Dropdown for Gender */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <label className="text-gray-700 font-semibold w-1/5">Gender:</label>
          <div className="w-3/5 flex items-center">
            {editFields["Gender"] ? (
              <select
                value={user["Gender"] || ""}
                onChange={(e) => handleChange("Gender", e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, "Gender")}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <span className="px-4 py-2">{user["Gender"] || "-"}</span>
            )}
          </div>
          <Button
            onClick={() => toggleEdit("Gender")}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
            size="sm"
          >
            {editFields["Gender"] ? "Done" : <MdEdit />}
          </Button>
        </div>
        <ProfileField label="Mobile" field="Mobile_No" />

        {/* Dropdown for Branch_Name with Search and Selection */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <label className="text-gray-700 font-semibold w-1/5">
            Branch Name:
          </label>
          <div className="w-3/5 flex items-center">
            {editFields["Branch_Name"] ? (
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search or Select Branch_Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, "Branch_Name")}
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
                          handleChange("Branch_Name", branch); // Update user["Branch_Name"]
                          setSearchTerm(""); // Clear search term
                          toggleEdit("Branch_Name"); // Close the edit mode
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
              <span className="px-4 py-2">{user["Branch_Name"] || "-"}</span>
            )}
          </div>
          <Button
            onClick={() => toggleEdit("Branch_Name")}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
            size="sm"
          >
            {editFields["Branch_Name"] ? "Done" : <MdEdit />}
          </Button>
        </div>

        {/* Dropdown for Branch_Region_Name with Search and Selection */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <label className="text-gray-700 font-semibold w-1/5">
            Branch Region:
          </label>
          <div className="w-3/5 flex items-center">
            {editFields["Branch_Region_Name"] ? (
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search or Select Branch Region"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, "Branch_Region_Name")}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {searchTerm && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {REGION.filter(
                      (region) =>
                        region.toLowerCase().includes(searchTerm.toLowerCase()) // Filter regions based on search term
                    ).map((region) => (
                      <li
                        key={region}
                        onClick={() => {
                          handleChange("Branch_Region_Name", region); // Update user["Branch_Region_Name"]
                          setSearchTerm(""); // Clear search term
                          toggleEdit("Branch_Region_Name"); // Close the edit mode
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
                {user["Branch_Region_Name"] || "-"}
              </span>
            )}
          </div>
          <Button
            onClick={() => toggleEdit("Branch_Region_Name")}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
            size="sm"
          >
            {editFields["Branch_Region_Name"] ? "Done" : <MdEdit />}
          </Button>
        </div>

        {/* Dropdown for Designation with Search and Selection */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <label className="text-gray-700 font-semibold w-1/5">
            Designation:
          </label>
          <div className="w-3/5 flex items-center">
            {editFields["Designation"] ? (
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search or Select Designation"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, "Designation")}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {searchTerm && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {filteredDesignations.map((designation) => (
                      <li
                        key={designation}
                        onClick={() => {
                          handleChange("Designation", designation); // Update user["Designation"]
                          setSearchTerm(""); // Clear search term
                          toggleEdit("Designation"); // Close the edit mode
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {designation}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <span className="px-4 py-2">{user["Designation"] || "-"}</span>
            )}
          </div>
          <Button
            onClick={() => toggleEdit("Designation")}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
            size="sm"
          >
            {editFields["Designation"] ? "Done" : <MdEdit />}
          </Button>
        </div>

        {/* Dropdown for Branch Type with Search and Selection */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <label className="text-gray-700 font-semibold w-1/5">
            Branch Type:
          </label>
          <div className="w-3/5 flex items-center">
            {editFields["Branch_Type"] ? (
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search or Select Branch Type"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, "Branch_Type")}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {searchTerm && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                    {BRANCH_TYPE.filter((branchType) =>
                      branchType
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ).map((branchType) => (
                      <li
                        key={branchType}
                        onClick={() => {
                          handleChange("Branch_Type", branchType); // Update user["Branch_Type"]
                          setSearchTerm(""); // Clear search term
                          toggleEdit("Branch_Type"); // Close the edit mode
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {branchType}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <span className="px-4 py-2">{user["Branch_Type"] || "-"}</span>
            )}
          </div>
          <Button
            onClick={() => toggleEdit("Branch_Type")}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
            size="sm"
          >
            {editFields["Branch_Type"] ? "Done" : <MdEdit />}
          </Button>
        </div>

        {/* qualifications */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <label className="text-gray-700 font-semibold w-1/5">
            Qualifications:
          </label>
          <div className="w-3/5 flex items-center">
            {editFields["Qualifications"] ? (
              <>
                <select
                  value={
                    QUALIFICATIONS.includes(user.Qualifications)
                      ? user.Qualifications
                      : "Other"
                  }
                  onChange={(e) => {
                    if (e.target.value === "Other") {
                      setShowCustomQualification(true);
                      handleChange("Qualifications", "");
                    } else {
                      setShowCustomQualification(false);
                      handleChange("Qualifications", e.target.value);
                    }
                  }}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="">Select Qualification</option>
                  {QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>
                      {q}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {showCustomQualification && (
                  <input
                    type="text"
                    placeholder="Enter custom qualification"
                    value={
                      !QUALIFICATIONS.includes(user.Qualifications)
                        ? user.Qualifications
                        : ""
                    }
                    onChange={(e) =>
                      handleChange("Qualifications", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-4 py-2 mt-2"
                  />
                )}
              </>
            ) : (
              <span className="px-4 py-2">{user.Qualifications || "-"}</span>
            )}
          </div>
          <Button
            onClick={() => toggleEdit("Qualifications")}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
            size="sm"
          >
            {editFields["Qualifications"] ? "Done" : <MdEdit />}
          </Button>
        </div>

        {/* Dropdown for Profile_Type */}
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <label className="text-gray-700 font-semibold w-1/5">
            Profile Type:
          </label>
          <div className="w-3/5 flex items-center">
            {editFields["Profile_Type"] ? (
              <select
                value={user["Profile_Type"] || ""}
                onChange={(e) => handleChange("Profile_Type", e.target.value)}
                onKeyDown={(e) => handleKeyPress(e, "Profile_Type")}
                className="w-full border border-gray-300 rounded-md px-4 py-2"
              >
                <option value="">Select Profile Type</option>
                <option value="Teaching">Teaching</option>
                <option value="Non-Teaching">Non-Teaching</option>
              </select>
            ) : (
              <span className="px-4 py-2">{user["Profile_Type"] || "-"}</span>
            )}
          </div>
          <Button
            onClick={() => toggleEdit("Profile_Type")}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
            size="sm"
          >
            {editFields["Profile_Type"] ? "Done" : <MdEdit />}
          </Button>
        </div>
      </div>

      {/* dropdown for marital status */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <label className="text-gray-700 font-semibold w-1/5">
          Marital Status:
        </label>
        <div className="w-3/5 flex items-center">
          {editFields["Marital_status"] ? (
            <select
              value={user["Marital_status"] || ""}
              onChange={(e) => handleChange("Marital_status", e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, "Marital_status")}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Select Marital Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Widowed">Widowed</option>
              <option value="Divorced">Divorced</option>
            </select>
          ) : (
            <span className="px-4 py-2">{user["Marital_status"] || "-"}</span>
          )}
        </div>
        <Button
          onClick={() => toggleEdit("Marital_status")}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
          size="sm"
        >
          {editFields["Marital_status"] ? "Done" : <MdEdit />}
        </Button>
      </div>

      {/* PAN no  */}
      <ProfileField label="PAN No" field="PAN_no" type="text" />

      {/* Present Address */}
      <ProfileField
        label="Present Address"
        field="Present_Address"
        type="text"
      />

      {/* Permanent Address */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <label className="text-gray-700 font-semibold w-1/5">
          Permanent Address:
        </label>
        <div className="w-3/5 flex items-center">
          {editFields["Permanent_Address"] ? (
            <input
              type="text"
              value={user["Permanent_Address"] || ""}
              onChange={(e) =>
                handleChange("Permanent_Address", e.target.value)
              }
              onKeyDown={(e) => handleKeyPress(e, "Permanent_Address")}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              autoFocus
            />
          ) : (
            <span className="px-4 py-2">
              {user["Permanent_Address"] || "-"}
            </span>
          )}
        </div>
        <Button
          onClick={() => toggleEdit("Permanent_Address")}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
          size="sm"
        >
          {editFields["Permanent_Address"] ? "Done" : <MdEdit />}
        </Button>
      </div>
      {/* Checkbox to copy Present Address to Permanent Address */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="sameAsPresent"
          onChange={(e) => {
            if (e.target.checked) {
              handleChange("Permanent_Address", user["Present_Address"]);
            }
          }}
          className="mr-2"
        />
        <label htmlFor="sameAsPresent" className="text-gray-700">
          Same as Present Address
        </label>
      </div>

      {/* date of joining */}
      <ProfileField
        label="Branch Joining Date"
        field="Branch_Joining_Date"
        type="date"
      />

      {/* Current Appointment Date */}
      <ProfileField
        label="Current Appointment Date"
        field="CurrentAppointmentDate"
        type="date"
      />

      {/*dropdown Current Appointment Type */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <label className="text-gray-700 font-semibold w-1/5">
          Current Appointment Type:
        </label>
        <div className="w-3/5 flex items-center">
          {editFields["CurrentAppointmentType"] ? (
            <select
              value={user["CurrentAppointmentType"] || ""}
              onChange={(e) =>
                handleChange("CurrentAppointmentType", e.target.value)
              }
              onKeyDown={(e) => handleKeyPress(e, "CurrentAppointmentType")}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Select Appointment Type</option>
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
              <option value="Probation">Probation</option>
            </select>
          ) : (
            <span className="px-4 py-2">
              {user["CurrentAppointmentType"] || "-"}
            </span>
          )}
        </div>
        <Button
          onClick={() => toggleEdit("CurrentAppointmentType")}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
          size="sm"
        >
          {editFields["CurrentAppointmentType"] ? "Done" : <MdEdit />}
        </Button>
      </div>

      {/* first appointment date */}
      <ProfileField
        label="First Appointment Date"
        field="FirstAppointmentDate"
        type="date"
      />

      {/* first joining date */}
      <ProfileField
        label="First Joining Date"
        field="FirstJoiningDate"
        type="date"
      />

      {/* first appointment type with dropdown */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <label className="text-gray-700 font-semibold w-1/5">
          First Appointment Type:
        </label>
        <div className="w-3/5 flex items-center">
          {editFields["FirstAppointmentType"] ? (
            <select
              value={user["FirstAppointmentType"] || ""}
              onChange={(e) =>
                handleChange("FirstAppointmentType", e.target.value)
              }
              onKeyDown={(e) => handleKeyPress(e, "FirstAppointmentType")}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Select Appointment Type</option>
              <option value="Permanent">Permanent</option>
              <option value="Temporary">Temporary</option>
              <option value="Probation">Probation</option>
            </select>
          ) : (
            <span className="px-4 py-2">
              {user["FirstAppointmentType"] || "-"}
            </span>
          )}
        </div>
        <Button
          onClick={() => toggleEdit("FirstAppointmentType")}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
          size="sm"
        >
          {editFields["FirstAppointmentType"] ? "Done" : <MdEdit />}
        </Button>
      </div>

      {/* DROPDOWN FOR EMPLYEE TYPE  */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <label className="text-gray-700 font-semibold w-1/5">
          Employee Type:
        </label>
        <div className="w-3/5 flex items-center">
          {editFields["EmployeeType"] ? (
            <select
              value={user["EmployeeType"] || ""}
              onChange={(e) => handleChange("EmployeeType", e.target.value)}
              onKeyDown={(e) => handleKeyPress(e, "EmployeeType")}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Select Employee Type</option>
              <option value="Granted">Granted</option>
              <option value="Non-Granted">Non-Granted</option>
            </select>
          ) : (
            <span className="px-4 py-2">{user["EmployeeType"] || "-"}</span>
          )}
        </div>
        <Button
          onClick={() => toggleEdit("EmployeeType")}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
          size="sm"
        >
          {editFields["EmployeeType"] ? "Done" : <MdEdit />}
        </Button>
      </div>

      {/* Approval ref no */}
      <ProfileField
        label="Approval Ref No"
        field="Approval_Ref_No"
        type="text"
      />

      {/* Approval letter date */}
      <ProfileField
        label="Approval Letter Date"
        field="Approval_letter_date"
        type="date"
      />

      {/* retirement date */}
      <ProfileField
        label="Retirement Date"
        field="Retirement_date"
        type="date"
      />

      {/* dropdown for Appointment Nature */}
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <label className="text-gray-700 font-semibold w-1/5">
          Appointment Nature:
        </label>
        <div className="w-3/5 flex items-center">
          {editFields["Appointment_Nature"] ? (
            <select
              value={user["Appointment_Nature"] || ""}
              onChange={(e) =>
                handleChange("Appointment_Nature", e.target.value)
              }
              onKeyDown={(e) => handleKeyPress(e, "Appointment_Nature")}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            >
              <option value="">Select Appointment Nature</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          ) : (
            <span className="px-4 py-2">
              {user["Appointment_Nature"] || "-"}
            </span>
          )}
        </div>
        <Button
          onClick={() => toggleEdit("Appointment_Nature")}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-1 px-3"
          size="sm"
        >
          {editFields["Appointment_Nature"] ? "Done" : <MdEdit />}
        </Button>
      </div>

      {/* dropdown with search and selection for Qualifications */}

      {/* Updated buttons section */}
      <div className="mt-6 flex justify-end space-x-4">
        <Button
          onClick={() => navigate("/sub-admin/view-users")}
          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors duration-200"
        >
          Back
        </Button>
        <Button
          onClick={handleUpdate}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
        >
          Save All Changes
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditUsers;
