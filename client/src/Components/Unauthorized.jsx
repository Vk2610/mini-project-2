import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  const backToHome = () => {
    const role = localStorage.getItem("role");
    navigate(`/${role}`);
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-red-600 mb-4">
        Unauthorized Access
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        You do not have permission to view this page.
      </p>
      <button
        onClick={() => backToHome()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
