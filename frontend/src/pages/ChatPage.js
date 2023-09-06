import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import Divider from "@mui/material/Divider";
import SearchComponent from "../components/SearchComponent";
import UserHitComponent from "../components/UserHitComponent";
const defaultTheme = createTheme();

const ChatPage = () => {
  const searchingObject = {
    index: "skwde_User",
    hitComponent: UserHitComponent,
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Typography variant="h6">Search through coaches!</Typography>
        <SearchComponent searchingObject={searchingObject} />
        <Divider />
      </Container>
    </ThemeProvider>
  );
};

export default ChatPage;
