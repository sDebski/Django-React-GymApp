import React, { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthContext from "../context/AuthContext";
import "react-datepicker/dist/react-datepicker.css";

const defaultTheme = createTheme();

export default function RegistrationPage() {
  let { registerUser } = useContext(AuthContext);
  const validatePassword = (pass) => {
    let regExpr = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return regExpr.test(pass);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const registerData = {
      first_name: data.get("first_name"),
      last_name: data.get("last_name"),
      password: data.get("password"),
      password2: data.get("password2"),
      email: data.get("email"),
      date_of_birth: data.get("date_of_birth"),
    };

    if (
      (registerData.email === "") |
      (registerData.password === "") |
      (registerData.password2 === "") |
      (registerData.first_name === "") |
      (registerData.last_name === "")
    ) {
      alert("Fill up all fields!");
      return;
    }

    if (!validatePassword(registerData.password)) {
      alert("Password has to be [6-16] characters long and contain a number!");
      return;
    }

    if (registerData.password !== registerData.password2) {
      alert("Passwords do not match!");
      return;
    }

    registerUser(registerData);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="first_name"
                  required
                  fullWidth
                  id="first_name"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
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
                />
              </Grid>

              <Grid item xs={12}>
                <span>Date of Birth</span>
                <TextField
                  required
                  fullWidth
                  name="date_of_birth"
                  type="date"
                  id="date_of_birth"
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
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
