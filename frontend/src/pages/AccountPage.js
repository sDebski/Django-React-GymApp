import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
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
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useRef } from "react";

const defaultTheme = createTheme();

const AccountPage = () => {
  const ref = useRef(null);
  let api = useAxios();
  const [user, setUser] = useState(null);
  let [profile, setProfile] = useState({ bio: "" });
  let [image, setImage] = useState(null);
  let [avatar, setAvatar] = useState(
    "http://127.0.0.1:8000/media/profiles/skwdemailcom-pobrane.jpg"
  );
  useEffect(() => {
    getUser();
  }, []);

  const getAvatar = async () => {
    let response = await api.get("users/profile/avatar");
    if (response.status === 200) {
      if (response.data.avatar !== null) {
        setAvatar(response.data.avatar);
      }
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  let getUser = async () => {
    let response = await api.get("/users/");
    if (response.status === 200) {
      console.log("setUser: ", response.data);
      setUser(response.data);
    }
  };

  const handlePasswordChange = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitData = {
      current_password: data.get("current_password"),
      new_password: data.get("new_password"),
      password2: data.get("password2"),
    };

    const validatePassword = (pass) => {
      let regExpr = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
      return regExpr.test(pass);
    };

    if (
      (submitData.current_password === "") |
      (submitData.new_password === "") |
      (submitData.password2 === "")
    ) {
      alert("Fill up all fields!");
      return;
    }

    if (!validatePassword(submitData.current_password)) {
      alert("Password has to be [6-16] characters long and contain a number!");
      return;
    }

    if (submitData.new_password !== submitData.password2) {
      alert("Passwords do not match!");
      return;
    }
    changePassword(submitData);
  };

  const changePassword = async (data) => {
    console.log(data);
    let response = await api
      .post("/users/change-password/", {
        current_password: data.current_password,
        new_password: data.new_password,
      })
      .then((response) => {
        if (response.status == 204) {
          alert("Password has been changed!");
        }
      })
      .catch((e) => {
        alert("Something went wrong!");
      });
    document.getElementById("password_box").reset();
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append("avatar", image);
    let response = await api
      .put("users/profile/avatar/", form_data)
      .then((response) => {
        if (response.status == 200) {
          getAvatar();
        }
      })
      .catch((error) => {
        alert("Something went wrong!");
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {user?.is_coach && "Coach "}
            {user && user?.first_name}`s Account
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <Divider />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography component="h4" variant="h6">
                Email: {user?.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography component="h4" variant="h6">
                First Name: {user?.first_name}
              </Typography>
              <Typography component="h4" variant="h6">
                Last Name: {user?.last_name}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography component="h4" variant="h6">
                Birth Date: {user?.date_of_birth}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            id="password_box"
            component="form"
            noValidate
            onSubmit={handlePasswordChange}
            sx={{ mt: 3 }}
          >
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Typography component="h4" variant="h6">
                  Current password
                </Typography>
                <TextField
                  ref={ref}
                  required
                  fullWidth
                  type="password"
                  label="Current Password"
                  id="current_password"
                  name="current_password"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography component="h4" variant="h6">
                  New password
                </Typography>
                <TextField
                  ref={ref}
                  required
                  fullWidth
                  type="password"
                  id="new_password"
                  label="New Password"
                  name="new_password"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <Typography component="h4" variant="h6">
                  Confirm Password
                </Typography>
                <TextField
                  ref={ref}
                  required
                  fullWidth
                  type="password"
                  id="password2"
                  label="Confirm Password"
                  name="password2"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Password
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default AccountPage;
