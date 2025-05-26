import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import rayatImage from "../assets/rayat-img.jpg";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      const role = decoded.role;
      localStorage.setItem("role", role);
      navigate(`/${role}`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${rayatImage})`,
        backgroundBlur: "blur(30px)",
      }}
    >
      <Card className="w-full max-w-md shadow-xl bg-white/95 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold text-gray-800">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
                <FaLock className="text-gray-700 mb-3 ml-2 text-0.5xl" />
                <Label
                  htmlFor="password"
                  className="mb-3 ml-1 text-0.5xl text-gray-700"
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="text-right">
              <Link
                to="/resetPassword"
                className="text-sm text-blue-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Login
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
