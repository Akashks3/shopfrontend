import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../Redux/LoginUserData/Action';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");

  const isAuth = useSelector((store) => store.loginUserData.isAuthenticate);
  console.log("home nav ", isAuth);

  const handleAdd = () => {
    const data = {
      "email": userEmail,
      "password": password
    };
    console.log("heloo", data);
    dispatch(login(data));
  };

  
  useEffect(() => {
    if (isAuth) {
      navigate("/"); 
    }
  }, [isAuth, navigate]); 
   const loginWithGoogle = () => {
    window.location.href = 'https://menshopbackend.onrender.com/auth/google';
  };
  return (
    <Box sx={{ width: '100%', maxWidth: 400, mx: 'auto', mt: 5, p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Login
      </Typography>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              focused
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              focused
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              className='ButtonDiv'
              variant="contained"
              fullWidth
              onClick={handleAdd}
            >
              Sign in
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              className='ButtonDiv'
              variant="outlined"
              fullWidth
              onClick={() => { navigate("/register") }}
            >
              Sign up
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              id='google'
              className='ButtonDiv'
              variant="contained"
              fullWidth
              onClick={loginWithGoogle}
              startIcon={<FcGoogle />}
            >
              Sign in with Google
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ToastContainer />
    </Box>
  );
}
