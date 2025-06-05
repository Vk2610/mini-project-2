import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import rayatImage from "../assets/rayat-img.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      const response = await axios.put(
        "http://localhost:3000/auth/resetPassword",
        { email, newPassword, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setSuccess(response.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Reset failed. Please try again."
      );
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${rayatImage})` }}
    >
      <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 text-white h-8 w-8 rounded-md flex items-center justify-center"
          >
            <IoIosArrowRoundBack className="text-xl" />
          </Button>
          <CardTitle className="text-2xl font-semibold text-gray-800 flex-grow text-center mr-8">
            Reset Password
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleReset} className="space-y-4">
            {/* Email */}
            <div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-gray-700 mb-3 ml-2 text-0.5xl" />
                <Label
                  htmlFor="email"
                  className="mb-3 ml-1 text-0.5xl text-gray-600"
                >
                  Email
                </Label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* New Password */}
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <FaLock className="text-gray-700 mb-3 ml-2 text-0.5xl" />
                <Label
                  htmlFor="newPassword"
                  className="mb-3 ml-1 text-0.5xl text-gray-700"
                >
                  New Password
                </Label>
              </div>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <FaLock className="text-gray-700 mb-3 ml-2 text-0.5xl" />
                <Label
                  htmlFor="confirmPassword"
                  className="mb-3 ml-1 text-0.5xl text-gray-700"
                >
                  Confirm Password
                </Label>
              </div>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Error/Success Messages */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600"
            >
              Reset Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
