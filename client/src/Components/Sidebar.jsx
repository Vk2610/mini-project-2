import React, { useState } from "react";
import { RiMenu2Fill, RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { FaUser, FaWpforms } from "react-icons/fa";
import { GoSignOut } from "react-icons/go";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get the current route

  return (
    <div className="h-screen overflow-hidden">
      {/* Toggle Button (only on sm and md) */}
      <div className="lg:hidden py-4 px-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 dark:bg-white dark:text-neutral-800 dark:hover:bg-neutral-200"
        >
          {isOpen ? <IoMdClose size={24} /> : <RiMenu2Fill size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 z-50 bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:block`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 dark:border-neutral-700">
          <span className="text-xl font-semibold dark:text-white">Rayat</span>
          {/* Close button for mobile (optional with X icon) */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-600 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex flex-col justify-between h-full">
          <ul className="space-y-2 p-4 overflow-y-auto">
            <li>
              <Link
                to="/profile"
                className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                  location.pathname === "/profile"
                    ? "bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-white"
                    : "text-gray-800 dark:text-white"
                }`}
              >
                <FaUser className="w-5 h-5" />
                Profile
              </Link>
            </li>

            <li>
              <Link
                to="/form"
                className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                  location.pathname === "/form"
                    ? "bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-white"
                    : "text-gray-800 dark:text-white"
                }`}
              >
                <FaWpforms className="w-5 h-5" />
                Application Form
              </Link>
            </li>

            <li>
              <Link
                to="/transactions"
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 ${
                  location.pathname === "/transactions"
                    ? "bg-gray-200 dark:bg-neutral-700 text-gray-900 dark:text-white"
                    : "text-gray-800 dark:text-white"
                }`}
              >
                <RiMoneyDollarCircleLine className="w-6 h-6" />
                Transactions
              </Link>
            </li>
          </ul>

          {/* Signout button at bottom */}
          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="flex items-center justify-center gap-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-200 text-sm font-medium"
            >
              <GoSignOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Overlay for sm/md when sidebar is open */}
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