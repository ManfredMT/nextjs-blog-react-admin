import React, {  useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate,Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { register, reset } from "../features/auth/authSlice";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//import Spinner from "../components/Spinner";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function Register() {
  

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  //console.log(user)

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if(user && !user?.name && user?.message) {
      const errMesg = user?.message?user.message:'Something went wrong';
      toast.error(errMesg);
    }

    if (isSuccess && user.name && user.token) {
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

 

  

  const theme = createTheme();


  const handleSubmit = (event) => {
    event.preventDefault();
    
    const data = new FormData(event.currentTarget);
    console.log(data.get('name'));
    console.log(data.get('invitationCode'));
    console.log(data.get('password'));
    
    if (data.get('password') !== data.get('password2')) {
      toast.error("Passwords do not match");
    } else {
      const userData = {
        name:data.get('name'),
        invitationCode:data.get('invitationCode'),
        password:data.get('password'),
      };
      //console.log('userData: ', userData)
      dispatch(register(userData));
    }
  };

  return (
    <>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
            <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Enter your name"
                  name="name"
                  autoComplete="username"
                 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="invitationCode"
                  label="Enter invitation code"
                  name="invitationCode"
                  autoComplete="invitation-code"
                />
              </Grid> 
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  label="Password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password2"
                  label="Confirm Password"
                  type="password"
                  id="password2"
                  autoComplete="off"
                />
              </Grid>
              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
              
               <Link variant="body2"
               component={RouterLink}
               to='/login'>
                  Already have an account? Sign in
                  </Link>
                
              </Grid>
            </Grid>
          </Box>
        </Box>
       
      </Container>
    </ThemeProvider>
      
    </>
  );
}

export default Register;
