// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import MainPage from './MainPage.jsx';
import AdminPage from './AdminPage.jsx';
import CreateAdmin from './CreateAdmin.jsx';

function App() {
  const [role, setRole] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setRole={setRole} />} />
        <Route path="/main" element={<MainPage role={role} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
