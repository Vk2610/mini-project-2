import React, { useState } from "react";
import axios from "axios";
import rayatImage from "../assets/Rayat.jpg";
import { Link, useNavigate } from "react-router-dom";

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
      const response = await axios.post("http://localhost:3000/user/resetPassword", {
        email,
        newPassword
      },{
        headers: {
          "Content-Type": "application/json",
        }, 
      });

      setSuccess(response.data.message || "Password reset successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${rayatImage})` }}
    >
      <form
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white items-center"
        onSubmit={handleReset}
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Reset Password</h1>

        <div className="mt-10 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6">
          <input
            type="email"
            placeholder="Email"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6">
          <input
            type="password"
            placeholder="New Password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="mt-4 w-full border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6">
          <input
            type="password"
            placeholder="Confirm Password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Reset Password
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-10">
          Remembered your password?{" "}
          <Link to="/login" className="text-indigo-500">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default ResetPassword;
