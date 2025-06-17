import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ResetPassword from "./Pages/ResetPassword";
import Home from "./Pages/Home";
import FormPage from "./Pages/users/FormPage";
import Transactions from "./Pages/users/Transactions";
import Profile from "./Pages/Profile";
import PrivateRoute from "./Components/PrivateRoute";
import Unauthorized from "./Components/Unauthorized";
import ClaimAmt from "./Pages/users/ClaimAmt";
import ShowReceipt from "./Pages/users/ShowReceipt";
import UserProfile from "./Pages/users/UserProfile";
import { jwtDecode } from "jwt-decode";
import ReceiptLayout from "./Pages/users/ReceiptLayout";
import ManageUsers from "./Pages/admin/ManageUsers";
import SubAdminProfile from "./Pages/sub-admin/SubAdminProfile";
import ViewSubAdmin from "./Pages/admin/ViewSubAdmin";
import ViewUsers from "./Pages/sub-admin/ViewUsers";
import EditUsers from "./Pages/sub-admin/EditUsers";
import AdminProfile from "./Pages/admin/AdminProfile";
import FileUpload from "./Pages/FileUpload";
import ManageForms from "./Pages/sub-admin/ManageForms";
// import Unauthorized from "./Components/Unauthorized";
import AmountClaimPreview from "./Components/AmountClaimPreview";
import HandleApplications from "./Pages/sub-admin/HandleApplications";
import ManageApplicationsAdmin from "./Pages/admin/ManageApplicationsAdmin";
import ShowForms from "./Pages/admin/ShowForms";
import Receipt from "./Pages/users/Receipt";

const App = () => {
  const token = localStorage.getItem("token");
  let userId = null;

  try {
    const decoded = jwtDecode(token);
    userId = decoded.id;
    console.log("Decoded ID:", userId); // Debugging line
  } catch (error) {
    console.error("Error decoding token:", error);
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/file-upload" element={<FileUpload />} />

        {/* User Routes */}
        <Route element={<PrivateRoute allowedRoles={["user"]} />}>
          <Route path="/user" element={<Home />}>
            <Route path="profile" element={<UserProfile />} />
            <Route path="form" element={<FormPage />} />
            <Route path="claim-amt" element={<ClaimAmt />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="receipt" element={<Receipt />} />
            <Route path="preview-claim" element={<AmountClaimPreview />} />
          </Route>
          <Route path="receipt/:id" element={<ShowReceipt />} />
        </Route>

        {/* Sub-Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["sub-admin"]} />}>
          <Route path="/sub-admin" element={<Home />}>
            <Route path="profile" element={<SubAdminProfile />} />
            <Route path="view-users" element={<ViewUsers />} />
            <Route path="users/:userId" element={<EditUsers />} />
            <Route path="manage-applications" element={<ManageForms />} />
            <Route
              path="view-application/:id"
              element={<HandleApplications />}
            />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<Home />}>
            <Route path="profile" element={<AdminProfile />} />
            <Route path="manage-users" element={<ManageUsers />} />
            <Route path="sub-admin/:userId" element={<ViewSubAdmin />} />
            <Route path="show-applications" element={<ShowForms />} />
            <Route
              path="manage-application/:id"
              element={<ManageApplicationsAdmin />}
            />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
