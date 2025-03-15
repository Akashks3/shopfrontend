import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../Redux/LoginUserData/Action';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const isAuth = useSelector((store) => store.loginUserData.isAuthenticate);

  const handleRegister = async () => {
    setLoading(true);
    setError("");
    
    const data = {
      name,
      email: userEmail,
      mobile,
      password: userPassword,
    };

    try {
      await dispatch(register(data));
      
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isAuth) {
    navigate("/");
  }
  const registerWithGoogle = () => {
    window.location.href = 'https://menshopbackend.onrender.com/auth/google/callback';
  };
  
  return (
    <div>
      <h1>Register</h1>
      <div id="registerBox">
        <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '45ch' },
          }}
          noValidate
          autoComplete="off"
        >

          {error && <div style={{ color: 'red' }}>{error}</div>}

          <TextField 
            label="Enter Name" 
            focused 
            onChange={(e) => setName(e.target.value)} 
          /><br /><br />

          <TextField 
            label="Enter Email" 
            focused 
            onChange={(e) => setUserEmail(e.target.value)} 
          /><br /><br />

          <TextField 
            label="Enter Mobile Number" 
            focused 
            onChange={(e) => setMobile(e.target.value)} 
          /><br /><br />

          <TextField 
            label="Enter Password" 
            type="password" 
            focused 
            onChange={(e) => setUserPassword(e.target.value)} 
          /><br /><br />

          <Button 
            className='Button' 
            variant="contained" 
            onClick={handleRegister} 
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
          <Button 
            className='Button' 
            variant="outlined" 
            onClick={() => navigate("/login")}
          >
            Login
          </Button><br />

          <Button 
            id='google' 
            variant="outlined" 
            onClick={registerWithGoogle}
          >
            <FcGoogle /> Sign in with Google
          </Button>
        </Box>
      </div>
    </div>
 )
} 
