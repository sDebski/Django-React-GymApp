import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import Divider from "@mui/material/Divider";

const defaultTheme = createTheme();

const ProfilePage = () => {
  let api = useAxios();
  let { user } = useContext(AuthContext);
  let [profile, setProfile] = useState({ bio: "" });
  let [image, setImage] = useState(null);
  let [avatar, setAvatar] = useState(
    "http://127.0.0.1:8000/api/media/profiles/skwdemailcom-pobrane.jpg"
  );
  useEffect(() => {
    getProfile();
    getAvatar();
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

  let getProfile = async () => {
    let response = await api.get("/users/profile/");
    if (response.status === 200) {
      setProfile(response.data);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    updateUserBio();
  };

  const updateUserBio = async () => {
    let response = await api.put("/users/profile/", {
      bio: profile.bio,
    });
    if (response.status === 200) {
      alert("Bio has been succesfully updated!");
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    let form_data = new FormData();
    form_data.append("avatar", image);
    await api
      .put("users/profile/avatar/", form_data)
      .then((response) => {
        if (response.status === 200) {
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
          <Avatar
            sx={{ width: 250, height: 250, bgcolor: "secondary.main" }}
            alt="Remy Sharp"
            src={avatar}
          />
          <Typography variant="h5">
            {user && user.first_name} Profile
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Typography component="h4" variant="h4">
                  Bio
                </Typography>
                <TextField
                  value={profile?.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  required
                  fullWidth
                  id="bio"
                  name="bio"
                  autoComplete={profile?.bio}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update profile
            </Button>
          </Box>
        </Box>
        <Divider />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            noValidate
            onSubmit={handleAvatarSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <Typography component="h4" variant="h4">
                  Update Avatar
                </Typography>
                <TextField
                  type="file"
                  id="image"
                  accept="image/png, image/jpeg"
                  onChange={handleImageChange}
                  required
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update Avatar
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ProfilePage;
