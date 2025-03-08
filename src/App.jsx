import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import Login from './componenets/Login.jsx';
import MainPage from './MainPage.jsx';
import AdminPage from './admins/AdminPage.jsx';
import CreateAdmin from './admins/CreateAdmin.jsx';
import ReportsPage from './ReportsPage.jsx';
import ProfitGoalPage from './ProfitGoalPage.jsx';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

import "./App.css"; 

const AppWrapper = () => {
  console.log("Stored Role in localStorage:", localStorage.getItem('role'));
  return (
    <Router>
      <App />
    </Router>
  );500
};

function App() {
  const [role, setRole] = useState(localStorage.getItem('role') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();
  const location = useLocation(); // Detect the current route

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      }
    }
  }, [navigate]);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div>
      {/* 🔹 Render Header only if NOT on login page */}
      {location.pathname !== "/login" && (
        <header className="app-header">
  <nav className="nav-container">
    {/* Left Spacer to Balance Centered Items */}
    <div className="nav-spacer"></div> 

    {/* 🔹 Centered Navigation Links */}
    <div className="nav-center">
      <Link to="/main" className="nav-link">📊 Dashboard</Link>
      <Link to="/reports" className="nav-link">📑 Reports</Link>
      <Link to="/profit-goals" className="nav-link">💰 Profit Goals</Link>
    </div>

    {/* 🔹 Right Aligned Logout Button */}
    <div className="logout-container">
      <button className="logout-btn" onClick={handleLogout}>
        <FontAwesomeIcon icon={faUser} style={{ color: "white", marginRight: "8px" }} /> Logout
      </button>
    </div>
  </nav>
</header>

      )}

      {/* 🔹 ROUTES */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/main" element={token ? <MainPage role={role} /> : <Navigate to="/login" />} />
        <Route path="/reports" element={token ? <ReportsPage /> : <Navigate to="/login" />} />
        <Route path="/profit-goals" element={token ? <ProfitGoalPage /> : <Navigate to="/login" />} />
        <Route path="/admin" element={role === 'subadmin' ? <AdminPage /> : <Navigate to="/main" />} />
        <Route path="/create-admin" element={role === 'subadmin' ? <CreateAdmin /> : <Navigate to="/main" />} />
      </Routes>
    </div>
  );
}

export default AppWrapper;
