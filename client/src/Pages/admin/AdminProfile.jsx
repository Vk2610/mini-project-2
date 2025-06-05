import React from 'react';
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminProfile = () => {
  const adminData = {
    fullname: "Badal",
    role: "admin",
    phone: "8010192225",
    email: "badal@gmail.com"
  };

  // For display purposes only since values are hardcoded
  const ProfileField = ({ label, value }) => (
    <div className="flex justify-between items-center mb-4 border-b pb-2">
      <label className="text-gray-700 font-semibold w-1/5">{label}:</label>
      <div className="w-3/5">
        <span className="px-4 py-2">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-2xl transition-all duration-300">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Admin Profile
            </h2>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-6">
            <ProfileField label="Full Name" value={adminData.fullname} />
            <ProfileField label="Role" value={adminData.role} />
            <ProfileField label="Phone" value={adminData.phone} />
            <ProfileField label="Email" value={adminData.email} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminProfile;