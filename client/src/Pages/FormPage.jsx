import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    position: "",
    branch: "",
    address: "",
    mobileNo: "",
    whatsappNo: "",
    email: "",
    dateOfAppointment: "",
    permanentDate: "",
    dateOfBirth: "",
    dateOfRetirement: "",
    bankRegNo: "",
    bankBranch: "",
    hrmsNo: "",
    nominee1: "",
    relation1: "",
    nominee2: "",
    relation2: "",
    signature: null,
  });

  const [loading, setLoading] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(true);

  useEffect(() => {
    if (location.state) {
      setFormData(location.state);
    }
  }, [location.state]);

  const handleChange = (e) => {
    if (e.target.type === 'file') {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleProceedToPay = (e) => {
    e.preventDefault();
    const requiredFields = [
      "lastName",
      "firstName",
      "middleName",
      "position",
      "branch",
      "address",
      "mobileNo",
      "whatsappNo",
      "email",
      "dateOfAppointment",
      "permanentDate",
      "dateOfBirth",
      "dateOfRetirement",
      "bankRegNo",
      "bankBranch",
      "hrmsNo",
      "nominee1",
      "relation1",
      "nominee2",
      "relation2",
      "signature",
    ];

    const isFormValid = requiredFields.every((field) => formData[field]);
    console.log("Form Data:", formData); // Debugging: Log form data
    if (!isFormValid) {
      toast.error("Please fill out all required fields before proceeding to pay.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    // Redirect to the payment URL
    window.location.href = "https://rzp.io/rzp/iF6qqC8";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPaymentSuccessful) {
      toast.error("Please complete the payment before submitting the form.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      // Get the current year
      const currentYear = new Date().getFullYear();
      formDataToSend.append("currentYear", currentYear);

      await axios.post("http://localhost:5000/api/form", formDataToSend);

      toast.success("Form submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });

      navigate("/preview", { state: { ...formData, currentYear } });
    } catch (error) {
      toast.error("Error submitting form", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      console.error("Error saving form", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        className="w-4/5 p-6 bg-white shadow-lg rounded-lg"
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
          Rayat Sevak Welfare Scheme Form
        </h2>

        {/* Form Fields */}
        {[{ label: "Full Name", fields: ["lastName", "firstName", "middleName"] },
          { label: "Position", fields: ["position"] },
          { label: "Branch", fields: ["branch"] },
          { label: "Permanent Address", fields: ["address"] },
          { label: "Mobile No.", fields: ["mobileNo"] },
          { label: "WhatsApp No.", fields: ["whatsappNo"] },
          { label: "Email", fields: ["email"] },
        ].map(({ label, fields, type = "text" }) => (
          <div key={fields[0]} className="mb-4">
            <label className="block text-gray-700">{label}:</label>
            <div className="flex gap-2">
              {fields.map((field) => (
                <input
                  key={field}
                  type={type}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Date Fields in Rows */}
        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Date of Appointment:</label>
            <input
              type="date"
              name="dateOfAppointment"
              value={formData.dateOfAppointment}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Permanent Date:</label>
            <input
              type="date"
              name="permanentDate"
              value={formData.permanentDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">Date of Retirement:</label>
            <input
              type="date"
              name="dateOfRetirement"
              value={formData.dateOfRetirement}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Nominee Details */}
        <h3 className="text-lg font-semibold text-gray-700 mt-4">Nominee Details</h3>
        {[{ label: "Nominee 1", fields: ["nominee1", "relation1"] },
          { label: "Nominee 2", fields: ["nominee2", "relation2"] },
        ].map(({ label, fields }) => (
          <div key={fields[0]} className="mb-4">
            <label className="block text-gray-700">{label}:</label>
            <div className="flex gap-2">
              {fields.map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  placeholder={field.replace(/([A-Z])/g, " $1")}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Signature Upload */}
        <div className="mb-4">
          <label className="block text-gray-700">Signature:</label>
          <input
            type="file"
            name="signature"
            accept="image/png, image/jpeg"
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleProceedToPay}
            className="w-1/2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition font-medium mr-2"
          >
            Proceed to Pay
          </button>
          <button
            onClick={handleSubmit}
            type="submit"
            disabled={!isPaymentSuccessful || loading}
            className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition font-medium ml-2"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default FormPage;