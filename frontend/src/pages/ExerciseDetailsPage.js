import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { useParams } from "react-router";
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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SearchComponent from "../components/SearchComponent";
import ExerciseHitComponent from "../components/ExerciseHitComponent";
import { useNavigate } from "react-router-dom";

const defaultTheme = createTheme();

const ExerciseDetailsPage = () => {
  const [comments, setComments] = useState([]);
  let api = useAxios();
  let { user } = useContext(AuthContext);
  const { id } = useParams();
  const [exercise, setExercise] = useState({});
  const baseURL = "http://127.0.0.1:8000/exercises/";
  const navigate = useNavigate();

  let handleDeleteExercise = async (id) => {
    console.log("Usuwam expense o id", id);
    let response = await api.delete(`exercises/${id}`);
    if (response.status === 204) {
      alert("You have succesfully deleted the expense!");
      navigate("/exercises/");
    } else alert("Something went wrong!");
  };

  const getExerciseDetail = async () => {
    let response = await fetch(baseURL + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setExercise(data);
      console.log(data);
    }
  };

  const handleCommentAddSubmit = (event) => {
    event.preventDefault();
    console.log();
  };

  useEffect(() => {
    getExerciseDetail();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography>
            {exercise.owner} | {exercise.title}
          </Typography>
          <Divider />
          {exercise.owner === user.first_name + " " + user.last_name && (
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() => handleDeleteExercise(exercise.id)}
            >
              <DeleteIcon />
            </IconButton>
          )}
          <List>
            {/* <ListItem
              key={hit.objectID}
              secondaryAction={}
              disablePadding
            >
              <ListItemButton
                component={Link}
                to={`/exercise/details/${hit.objectID}`}
              >
                <ListItemText
                  primary={`${hit.title} | ID: ${hit.objectID}`}
                  secondary={hit.get_owner_first_name_last_name}
                />
                <p>{hit.get_categories}</p>
                <p>{hit.get_likes}</p>
              </ListItemButton>
            </ListItem> */}
          </List>

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
                    Add Comment
                  </Typography>
                </Grid>
              </Grid>

              <Box
                component="form"
                noValidate
                onSubmit={handleCommentAddSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      fullWidth
                      id="body"
                      label="Content"
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
                  Add Comment
                </Button>
              </Box>
            </Box>
          )}
        </Box>
        <Divider />
      </Container>
    </ThemeProvider>
  );
};

export default ExerciseDetailsPage;
