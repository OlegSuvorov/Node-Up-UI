import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useAuth } from '../../hooks/useAuth';

function SignIn() {
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await login(data.get('email'));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgColor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            variant="outlined"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            sx={{
              '& .MuiInputBase-input': {
                '&:-webkit-autofill': {
                  '-webkit-box-shadow': '0 0 0 100px #121212 inset !important',
                  '-webkit-text-fill-color': '#fff !important',
                }
              }
            }}
          />
          <TextField
            margin="normal"
            variant="outlined"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            sx={{
              '& .MuiInputBase-input': {
                '&:-webkit-autofill': {
                  '-webkit-box-shadow': '0 0 0 100px #121212 inset !important',
                  '-webkit-text-fill-color': '#fff !important',
                }
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="center">
            <Grid item>
              <Link component={RouterLink} to="/signUp">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;