import React, { useState } from 'react';

const AdminForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // Default role is admin

  const handleAddAdmin = async (e) => {
    e.preventDefault();

    const newAdmin = { name, email, password, role };

    // Send a request to your backend to add the admin to the database
    // Example: fetch('/api/addAdmin', { method: 'POST', body: newAdmin });

    console.log('New Admin:', newAdmin);
    alert('Admin added successfully!');
    // Clear the form after submission
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div>
      <h3>Add Admin</h3>
      <form onSubmit={handleAddAdmin}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="subadmin">Subadmin</option>
          </select>
        </div>
        <button type="submit">Add Admin</button>
      </form>
    </div>
  );
};

export default AdminForm;
