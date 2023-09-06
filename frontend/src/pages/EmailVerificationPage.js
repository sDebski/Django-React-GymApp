import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const EmailVerificationPage = () => {
  const [queryParameters] = useSearchParams();
  const [emailVerified, setEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let email = queryParameters.get("emailVerified");
    if (email === "true") setEmailVerified(true);
    else setEmailVerified(false);
  }, [emailVerified, queryParameters]);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate("/login");
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
            {emailVerified ? (
              <DoneOutlineIcon />
            ) : (
              <SentimentVeryDissatisfiedIcon />
            )}
          </Avatar>
          <Typography component="h1" variant="h5">
            {emailVerified ? (
              <p>Email has been succesfully verified! You can now log in!</p>
            ) : (
              <p>Email verification went wrong...</p>
            )}
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Go to Login Page
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default EmailVerificationPage;
