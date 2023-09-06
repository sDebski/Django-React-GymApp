import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import useAxios from "../utils/useAxios";

const ResponsiveAppBar = () => {
  let { user, logoutUser, registerUser } = React.useContext(AuthContext);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  let api = useAxios();

  let [userAvatar, setUserAvatar] = React.useState(
    "http://127.0.0.1:8000/api/media/profiles/skwdemailcom-pobrane.jpg"
  );

  const pages = [
    { name: "Expenses", url: "expenses/" },
    { name: "Exercises", url: "exercises/" },
    { name: "Chat", url: "chat/" },
  ];

  const no_user_pages = [
    { name: "Sign In", url: "login/" },
    { name: "Sign Up", url: "register/" },
  ];

  const settings_authenticated = [
    { name: "Profile", url: "profile/" },
    { name: "Account", url: "account/" },
  ];

  const getAvatar = async () => {
    if (user !== null) {
      let response = await api.get("users/profile/avatar");
      if (response.status === 200) {
        if (response.data.avatar !== null) {
          setUserAvatar(response.data.avatar);
        }
      }
    }
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    getAvatar();
    console.log(user);
  });

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            GymApp
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {user !== null
                ? pages.map((page) => (
                    <MenuItem
                      component={Link}
                      to={page.url}
                      key={page.name}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))
                : no_user_pages.map((page) => (
                    <MenuItem
                      component={Link}
                      to={page.url}
                      key={page.name}
                      onClick={handleCloseNavMenu}
                    >
                      <Typography textAlign="center">{page.name}</Typography>
                    </MenuItem>
                  ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            GymApp
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {user !== null
              ? pages.map((page) => (
                  <Button
                    component={Link}
                    to={page.url}
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.name}
                  </Button>
                ))
              : no_user_pages.map((page) => (
                  <Button
                    component={Link}
                    to={page.url}
                    key={page.name}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.name}
                  </Button>
                ))}
          </Box>
          {user && (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src={userAvatar} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings_authenticated.map((setting) => (
                  <MenuItem
                    component={Link}
                    to={setting.url}
                    key={setting.name}
                    onClick={handleCloseUserMenu}
                  >
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
                {user !== null && (
                  <MenuItem
                    component={Link}
                    to="login/"
                    key="logout"
                    onClick={logoutUser}
                  >
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
