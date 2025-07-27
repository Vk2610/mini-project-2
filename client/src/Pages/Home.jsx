import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import UserHome from "../Components/UserHome";

const Home = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
