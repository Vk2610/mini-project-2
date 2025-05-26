import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import rayatImage from "../assets/rayat-img.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaUser, FaLock } from "react-icons/fa";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        { username, email, password, role },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        console.log("Registration successful");
        navigate("/");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${rayatImage})` }}
    >
      <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-800">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-700 mb-3 ml-2 text-0.5xl" />
                <Label
                  htmlFor="username"
                  className="mb-3 ml-1 text-0.5xl text-gray-600"
                >
                  Username
                </Label>
              </div>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <svg
                  width="16"
                  height="11"
                  viewBox="0 0 16 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-gray-700 mb-3 ml-2"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                    fill="#6B7280"
                  />
                </svg>
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
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <FaLock className="text-gray-700 mb-3 ml-2 text-0.5xl" />
                <Label
                  htmlFor="password"
                  className="mb-3 ml-1 text-0.5xl text-gray-600"
                >
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mt-2">
              <Label htmlFor="role" className="mb-1 ml-1 text-gray-600">
                Select Role
              </Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
    </div>
  );
};

export default Register;
