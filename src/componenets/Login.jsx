import React from 'react'
import Signup from './Signup'
import { Link } from 'react-router-dom';
import '../styling-sheet/Signin-up.css'

const Login = () => {
  return (
  <div className='login-container'>
      <form className='login'>
        <h1 className='h1-sign'>Welcome</h1>
        <label>Email <br/>
            <input className='input-sign' type="email" name="email" placeholder='john@example.com'/>
        </label> <br/>
        <label>Password <br/>
            <input className='input-sign' type="password" name="password" placeholder='password'/>
        </label> <br/> <br/>
        <button className='btn-log' type="submit">
            Sign in
        </button>
        <div className='tosignup'>
            <p className='text-login'>Don&apos;t have an account ?</p> 
            <p><Link to="/Signup"> Sign up </Link></p>
        </div>
      </form>
      </div>
  )
}

export default Login
