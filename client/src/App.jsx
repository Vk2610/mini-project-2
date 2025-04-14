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
import FormPage from "./Pages/FormPage";
import Transactions from "./Pages/Transactions";
import Profile from "./Pages/Profile";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if token exists

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/home" /> : <Register />}
        />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* Protected Routes */}
        {isAuthenticated ? (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/form" element={<FormPage />} />
            <Route path="/transactions" element={<Transactions />} />
          </>
        ) : (
          // Redirect all protected routes to login if not authenticated
          <Route path="*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
