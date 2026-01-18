import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "../pages/login/login";
import Register from "../pages/register/register";
import Attendance from "../pages/attendance/attendance";
import Dashboard from "../pages/dashboard/dashboard";
import Home from "../pages/home/home";
import Menu from "../pages/menu/menu";
import Events from "../pages/events/events";
// import Profile from "../pages/profile/profile";

function Protected({ isAuthenticated, children }) {
   if (isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  function handleLogin() {
    setIsAuthenticated(true);
  }

  function handleRegister() {
    setIsAuthenticated(true);
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onRegister={handleRegister} />} />

        <Route
          element={
            <Protected isAuthenticated={isAuthenticated}>
              <Menu />
            </Protected>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile" element={<Attendance/>} />
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Route>

        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}
