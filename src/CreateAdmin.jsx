import React, { useState } from 'react';

const CreateAdmin = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent the form from refreshing the page

    // Collect form data as JSON
    const formData = {
      name,
      email,
      password,
      role,
    };

    // Send form data as JSON
    try {
        const response = await fetch('http://localhost:5001/admins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        if (response.ok) {
          console.log('Success:', data);
          alert('Admin created successfully!');
  
          // Clear form fields after success:
          setName('');
          setEmail('');
          setPassword('');
          setRole('admin');  // or whichever default you'd like
        } else {
          console.error('Error:', data);
          alert('Failed to create admin.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to create admin.');
      }
    };

  return (
    <div>
      <h2>Create Admin</h2>
      <form id="adminForm" onSubmit={handleSubmit} autoComplete="off">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <br />
        <br />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="off"
        />
        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="off"
        />
        <br />
        <br />

        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="admin">Admin</option>
          <option value="subadmin">Subadmin</option>
        </select>
        <br />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreateAdmin;
