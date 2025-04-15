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
  const isAuthenticated = !!localStorage.getItem("token"); // Checks if token exists

  return (
    <Router>
      <Routes>
        {/* Default redirect based on auth */}
        <Route
          path="/"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />

        {/* Public routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/home" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/home" />}
        />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/form"
          element={isAuthenticated ? <FormPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={
            isAuthenticated ? <Transactions /> : <Navigate to="/login" />
          }
        />

        {/* Catch-all: redirect to proper page */}
        <Route
          path="*"
          element={<Navigate to={isAuthenticated ? "/home" : "/login"} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
