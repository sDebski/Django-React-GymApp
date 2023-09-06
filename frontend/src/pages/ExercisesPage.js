import React, { useEffect, useState, useContext } from "react";
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
import AuthContext from "../context/AuthContext";
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
import { IconButton, useRadioGroup } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchComponent from "../components/SearchComponent";
import ExerciseHitComponent from "../components/ExerciseHitComponent";

const defaultTheme = createTheme();

const ExercisesPage = () => {
  let { user } = useContext(AuthContext);
  const searchingObject = {
    index: "skwde_Exercise",
    hitComponent: ExerciseHitComponent,
  };
  let baseURL = "http://127.0.0.1:8000/api/";
  const [currentCategory, setCurrentCategory] = useState("");
  const changeCategory = (newCategory) => {
    setCurrentCategory(newCategory);
  };
  let api = useAxios();
  const [loaded, setLoaded] = useState(false);
  const [categories, setCategories] = useState(null);

  const getCategories = async () => {
    await fetch(baseURL + "exercises/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.results);
        setCurrentCategory(data.results[0].id.toString());
      })
      .then(() => setLoaded(true));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let listOfCategories = [];
    listOfCategories.push(currentCategory);
    const data = new FormData(event.currentTarget);
    const submitData = {
      categories: listOfCategories,
      title: data.get("title"),
      body: data.get("body"),
    };

    addExercise(submitData);
  };

  const addExercise = async (data) => {
    let response = await api.post("exercises/", {
      categories: data["categories"],
      title: data["title"],
      body: data["body"],
    });
    if (response.status === 201) {
      alert("Exercise has been successfully added!");
      document.getElementById("add_exercise_form").reset();
    } else {
      alert("Something went wrong!");
    }
  };

  useEffect(() => {
    if (user.is_coach) {
      getCategories();
    }
  }, [loaded, user]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Typography variant="h6">Search through exercises!</Typography>
        <SearchComponent searchingObject={searchingObject} />
        <Divider />
        {user.is_coach && (
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6} sm={2}>
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <AddIcon />
                </Avatar>
              </Grid>
              <Grid item xs={6} sm={10}>
                <Typography component="h1" variant="h6">
                  Add Exercise (For Coach)
                </Typography>
              </Grid>
            </Grid>

            <Box
              component="form"
              id="add_exercise_form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    name="title"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={6} sm={6}>
                  <select
                    required
                    onChange={(event) => changeCategory(event.target.value)}
                    value={currentCategory}
                  >
                    {loaded &&
                      categories.map((category) => (
                        <option value={category.id}>{category.name}</option>
                      ))}
                  </select>
                </Grid>

                <Grid item xs={12} sm={12}>
                  <TextField
                    required
                    fullWidth
                    id="body"
                    label="Description"
                    name="body"
                    autoComplete="body"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Add Exercise
              </Button>
            </Box>
          </Box>
        )}
        <Divider />
      </Container>
    </ThemeProvider>
  );
};

export default ExercisesPage;
