import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importing necessary components
import './App.css';
import Login from './componenets/Login';
import Signup from './componenets/Signup';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
