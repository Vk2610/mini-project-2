
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ResetPassword from "./Pages/ResetPassword";
import Home from "./Pages/Home";

function App() {
  const isAuthenticated = localStorage.getItem("token"); // or useContext/authProvider

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* Protected Routes */}
        {isAuthenticated && (
          <Route path="/home" element={<Home />}>
            {/* <Route path="profile" element={<Profile />} />
            <Route path="form" element={<FormSection />} />
            <Route path="/history" element={<Transactions />} /> */}
          </Route>
        )}

        {/* Redirect to login if not authenticated */}
        {!isAuthenticated && (
          <Route path="/home/*" element={<Navigate to="/login" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
