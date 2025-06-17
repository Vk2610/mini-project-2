import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiMenu2Fill } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";
import { GoSignOut } from "react-icons/go";
import { USER_LINKS, SUBADMIN_LINKS, ADMIN_LINKS } from "../utils/navigation";
import rayatLogo from "../assets/Rayat-logo.png"; // Fixed import path

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // State for toggling sidebar on small screens
  const location = useLocation(); // Get the current route

  // Assume the user's role is fetched from localStorage or context
  const userRole = localStorage.getItem("role") || "user"; // Default to "user"

  // Determine which links to render based on the role
  let links = [];
  if (userRole === "user") {
    links = USER_LINKS;
  } else if (userRole === "sub-admin") {
    links = SUBADMIN_LINKS;
  } else if (userRole === "admin") {
    links = ADMIN_LINKS;
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:block`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-neutral-700">
          <img src={rayatLogo} alt="Rayat Logo" className="w-20 h-20" />
          {/* Close button for mobile */}
          <span>Rayat Shikshan Santha, Satara</span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col justify-between">
          <ul className="space-y-2 p-4 overflow-y-auto">
            {links.map((link) => (
              <li key={link.key}>
                <Link
                  to={link.Path}
                  className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                    location.pathname === link.Path
                      ? "bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-white"
                      : "text-gray-800 dark:text-white"
                  }`}
                >
                  <link.icon className="w-5 h-5" /> {/* Render the icon */}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Signout button at bottom */}
          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                window.location.href = "/";
              }}
              className="flex items-center justify-center gap-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium"
            >
              <GoSignOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Toggle Button for Small Screens */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
        >
          {isOpen ? <IoMdClose size={24} /> : <RiMenu2Fill size={24} />}
        </button>
      </div>

      {/* Overlay for Small Screens */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Sidebar;
