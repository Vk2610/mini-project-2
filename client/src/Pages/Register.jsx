import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { BRANCHES, REGION } from "../utils/branches";
import { ToastContainer, toast } from "react-toastify";
import rayatImage from "../assets/rayat-img.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaSchool,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaUserTag,
} from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
    HRMS_No: "",
    Email_ID: "",
    Branch_Name: "",
    branch_region_name: "",
    Mobile_No: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        toast.success("Registration successful!");
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen py-10 bg-cover bg-center bg-no-scroll"
      style={{
        backgroundImage: `url(${rayatImage})`,
        backgroundAttachment: "fixed",
      }}
    >
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-md my-8">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-semibold text-gray-800">
              Register
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              {/* HRMS No Field */}
              <div>
                <div className="flex items-center gap-2">
                  <FaUser className="text-gray-700 mb-3 ml-2 text-lg" />
                  <Label htmlFor="HRMS_No" className="mb-3 ml-1 text-gray-600">
                    HRMS No
                  </Label>
                </div>
                <Input
                  id="HRMS_No"
                  name="HRMS_No"
                  placeholder="Enter your HRMS No"
                  value={formData.HRMS_No}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-700 mb-3 ml-2 text-lg" />
                  <Label htmlFor="Email_ID" className="mb-3 ml-1 text-gray-600">
                    Email
                  </Label>
                </div>
                <Input
                  id="Email_ID"
                  name="Email_ID"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.Email_ID}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Branch Field */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <FaSchool className="text-gray-700 mb-3 ml-2 text-lg" />
                  <Label
                    htmlFor="Branch_Name"
                    className="mb-3 ml-1 text-gray-600"
                  >
                    Branch
                  </Label>
                </div>
                <select
                  id="Branch_Name"
                  name="Branch_Name"
                  value={formData.Branch_Name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  required
                >
                  <option value="">Select Branch</option>
                  {BRANCHES.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Region Field */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-700 mb-3 ml-2 text-lg" />
                  <Label
                    htmlFor="branch_region_name"
                    className="mb-3 ml-1 text-gray-600"
                  >
                    Region
                  </Label>
                </div>
                <select
                  id="branch_region_name"
                  name="branch_region_name"
                  value={formData.branch_region_name}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  required
                >
                  <option value="">Select Region</option>
                  {REGION.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Number Field */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <FaMobileAlt className="text-gray-700 mb-3 ml-2 text-lg" />
                  <Label
                    htmlFor="Mobile_No"
                    className="mb-3 ml-1 text-gray-600"
                  >
                    Mobile Number
                  </Label>
                </div>
                <Input
                  id="Mobile_No"
                  name="Mobile_No"
                  type="tel"
                  placeholder="Enter your mobile number"
                  value={formData.Mobile_No}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <FaLock className="text-gray-700 mb-3 ml-2 text-lg" />
                  <Label htmlFor="password" className="mb-3 ml-1 text-gray-600">
                    Password
                  </Label>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Role Field */}
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <FaUserTag className="text-gray-700 mb-3 ml-2 text-lg" />
                  <Label htmlFor="role" className="mb-3 ml-1 text-gray-600">
                    Select Role
                  </Label>
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-md text-gray-600"
                  required
                >
                  <option value="user">User</option>
                  <option value="sub-admin">Sub-admin</option>
                  {/* <option value="admin">Admin</option> */}
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600"
              >
                Register
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-indigo-600 hover:underline">
                Sign In
              </Link>
            </p>
          </CardContent>
        </Card>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Register;
