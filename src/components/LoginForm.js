import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Image from '../images/posco3.png';
import authService from '../services/auth.service';
import { useHistory, withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import { Alert } from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        POSCO ICT Hwasa
      </Link>{' '}
      {new Date().getFullYear()}
      <p className='request'>문의: 김윤욱 프로(yunuk.kim@poscoict.com)</p>
    </Typography>
  );
}

const theme = createTheme();

function SignInSide() {
  const history = useHistory();
  const [count, setCount] = React.useState(0);
  const [alert, setAlert] = React.useState(false);
  React.useEffect(() => {
    
    setTimeout(() => {
      console.log(count);
      setAlert(false);
    }, 2000);
  }, [count]);
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
    authService.login(data.get('email'), data.get('password')).then(
      () => {
          history.push("/");
          window.location.reload();
      },error => {
        setAlert(true);
        setCount(count=>count+1);
      });
  }

  return (
    <ThemeProvider theme={theme}>
       {(alert)&& ( <Alert severity="error">아이디 혹은 패스워드가 틀렸습니다.</Alert>)}     
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />        
        <Grid
          item
          xs={false}
          sm={4}
          md={9}
          sx={{
            backgroundImage: `url(${Image})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              HR+ Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Username"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
export default withRouter(SignInSide);