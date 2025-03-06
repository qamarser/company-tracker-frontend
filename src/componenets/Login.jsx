// Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Signup from './Signup'
import { Link } from 'react-router-dom';
import '../styling-sheet/Signin-up.css'

const Login = ({ setRole }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://finance-x1t2.onrender.com/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        alert(`Login failed: ${data.error}`);
        return;
      }

      // data.token = JWT, data.user = { role, ... }
      localStorage.setItem('token', data.token); // store JWT
      setRole(data.user.role);
      navigate('/main');
    } catch (err) {
      console.error('Error logging in:', err);
      alert('Error logging in. See console for details.');
    }
  };

  return (
    <div className='login-container'>     
      <form onSubmit={handleLogin} className='login'>
      <h1 className='h1-sign'>Login</h1>
      <label>Email <br/>
            <input className='input-sign'
             type="email" 
             name="email" 
             placeholder='john@example.com'
             value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            />
        </label> <br/>
        <label>Password <br/>
            <input className='input-sign' 
            type="password" name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='password'/>
        </label> <br/> <br/>
        <button className='btn-log' type="submit">
            Sign in
        </button>
        {/* <div className='tosignup'>
            <p className='text-login'>Don&apos;t have an account ?</p> 
            <p><Link to="/Signup"> Sign up </Link></p>
        </div> */}
      </form>
    </div>
  );
};

export default Login;
