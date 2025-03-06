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
    <div className='login-container'>
      <form  className='login' id="adminForm" onSubmit={handleSubmit} autoComplete="off">
      <h1 className='h1-sign'>Registration</h1>
      <label>Name: <br/> 
            <input className='input-sign' 
            type='text' 
            placeholder='Username'
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
            />
        </label> <br/> 

        <label>Email: <br/>
            <input className='input-sign' 
            type="email" 
            name="email" 
            placeholder='john@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
            />
        </label> <br/>

        <label>Password: <br/>
            <input className='input-sign' 
            type="password" 
            name="password" 
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
            />
        </label> <br/> <br/>

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
        <br/>
        <br/>

        <button className='btn-log' type="submit">
            Sign in
        </button>
      </form>
    </div>
  );
};

export default CreateAdmin;
