import React, { useContext } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createContext, useState, useEffect } from "react";
import {
  Routes,
  Route,
  useSearchParams,
  BrowserRouter,
} from "react-router-dom";

const defaultTheme = createTheme();

export default function ResetPasswordNewPasswordPage() {
  let baseURL = "http://127.0.0.1:8000/api/users/";
  const navigate = useNavigate();
  const [queryParameters] = useSearchParams();
  const [tokenValid, setTokenValid] = useState(false);
  const [uidb64, setUidb64] = useState(null);
  const [token, setToken] = useState(null);
  const [passwordChanged, setPasswordChanged] = useState(false);

  useEffect(() => {
    let tokenValid = queryParameters.get("token_valid");
    let uidb64 = queryParameters.get("uidb64");
    let token = queryParameters.get("token");
    if (tokenValid == "true") setTokenValid(true);
    else setTokenValid(false);
    setUidb64(uidb64);
    setToken(token);
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitData = {
      password: data.get("password"),
      password2: data.get("password2"),
    };

    const validatePassword = (pass) => {
      let regExpr = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      return regExpr.test(pass);
    };

    if ((submitData.password === "") | (submitData.password2 === "")) {
      alert("Fill up all fields!");
      return;
    }

    if (!validatePassword(submitData.password)) {
      alert("Password has to be [6-16] characters long and contain a number!");
      return;
    }

    if (submitData.password !== submitData.password2) {
      alert("Passwords do not match!");
      return;
    }

    resetPasswordSetNewPassword(submitData);
  };

  let resetPasswordSetNewPassword = async (data) => {
    let response = await fetch(baseURL + "password-reset-complete/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: data["password"],
        uidb64: uidb64,
        token: token,
      }),
    });

    if (response.status === 200) {
      setPasswordChanged(true);
      alert("Password has been successfully changed!");
    } else {
      alert("Something went wrong!");
    }
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
            Reset Password
          </Typography>
          {tokenValid ? (
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
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
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Reset Password
              </Button>
            </Box>
          ) : (
            <Typography component="h1" variant="h5">
              <p>Token is not valid. Try to send reset email again!</p>
            </Typography>
          )}
          {passwordChanged ? (
            <Typography component="h1" variant="h5">
              <p>Password has been changed!</p>
            </Typography>
          ) : (
            <p></p>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}
