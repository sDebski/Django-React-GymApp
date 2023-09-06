import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import Divider from "@mui/material/Divider";

const defaultTheme = createTheme();

const HomePage = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h1">
            Welcome to <p>GYM APP</p>
          </Typography>
          <Typography variant="h6">
            Select the section from navigation bar
          </Typography>
        </Box>

        <Divider />
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
