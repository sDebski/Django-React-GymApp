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
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ChatIcon from "@mui/icons-material/Chat";

const defaultTheme = createTheme();

const ExerciseDetailsPage = () => {
  const [comments, setComments] = useState([]);
  let api = useAxios();
  let { user } = useContext(AuthContext);
  const { id } = useParams();
  const [exercise, setExercise] = useState({});
  const [currentComment, setCurrentComment] = useState("");
  const [currentCommentID, setCurrentCommentID] = useState(null);
  const baseURL = "http://127.0.0.1:8000/exercises/";
  const navigate = useNavigate();
  const [likeDislike, setLikeDislike] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let handleDeleteExercise = async (id) => {
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
      setLoaded(true);
      // console.log(data);
    }
  };

  const getAllComments = async () => {
    let response = await fetch(baseURL + `${id}/comment`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      let new_data = addEditValueForEachComment(data.results);
      setComments(new_data);
    }
  };

  const addEditValueForEachComment = (data) => {
    let result = data;
    result.map((el) => (el["editView"] = false));
    return result;
  };

  const handleCommentAddSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = data.get("body");
    addComment(body);
  };

  const handleCommentUpdateSubmit = (event) => {
    event.preventDefault();
    updateComment();
  };

  const updateComment = async () => {
    let response = await api.put(
      `exercises/${id}/comment/${currentCommentID}/`,
      {
        exercise: id,
        body: currentComment,
      }
    );
    if (response.status == 200) {
      getExerciseDetail();
      getAllComments();
    }
  };

  const addComment = async (body) => {
    let response = await api.post(`exercises/${id}/comment/`, {
      exercise: id,
      body: body,
    });
    if (response.status == 201) {
      getExerciseDetail();
      getAllComments();
    }
  };

  const handleLikeDislikeButton = async () => {
    let response = await api.get(`exercises/like/${id}`);
    if (response.status === 200) {
      setLikeDislike(!likeDislike);
      getExerciseDetail();
    }
  };
  const checkIfExerciseLikedByUser = () => {
    let result = false;
    for (let i = 0; i < exercise.likes?.length; i++) {
      if (
        exercise.likes[i][0] == user.first_name &&
        exercise.likes[i][1] == user.last_name
      ) {
        result = true;
        break;
      }
    }
    setLikeDislike(result);
  };

  const handleDeleteComment = async (comment_id) => {
    let response = await api.delete(`exercises/${id}/comment/${comment_id}/`);
    if (response.status === 204) {
      alert("You succesfully deleted the comment!");
      getAllComments();
    }
  };

  const changeEditViewOnItem = (id) => {
    let result = structuredClone(comments);
    result.map((el) => {
      if (el.id === id) {
        if (!el.editView) setCurrentComment(el.body);
        el.editView = !el.editView;
      } else el.editView = false;
    });
    setCurrentCommentID(id);
    setComments(result);
  };

  const changeDate = (date) => {
    let date_splitted = date.slice(0, 19).split("T");
    return `${date_splitted[0]} ${date_splitted[1]}`;
  };

  useEffect(() => {
    getExerciseDetail();
    if (loaded) {
      checkIfExerciseLikedByUser();
    }
    getAllComments();
  }, [loaded]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">
            {exercise.owner} | {exercise.title}
          </Typography>
          <Typography>{exercise.body}</Typography>
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
          {user && (
            <IconButton
              edge="end"
              aria-label="comments"
              onClick={() => handleLikeDislikeButton(exercise.id)}
            >
              {exercise.likes?.length}
              {likeDislike ? <ThumbDownAltIcon /> : <ThumbUpAltIcon />}
            </IconButton>
          )}
          <List>
            {comments &&
              comments.map((comment) =>
                comment.owner === user.first_name + " " + user.last_name ? (
                  <div>
                    <ListItemButton
                      onClick={() => changeEditViewOnItem(comment.id)}
                    >
                      <ListItem
                        key={comment.id}
                        secondaryAction={
                          comment.owner ===
                            user.first_name + " " + user.last_name && (
                            <IconButton
                              edge="end"
                              aria-label="comments"
                              onClick={() => handleDeleteComment(comment.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )
                        }
                      >
                        <ListItemText
                          primary={`${comment.owner} | ${changeDate(
                            comment.updated_at
                          )}`}
                          secondary={comment.body}
                        ></ListItemText>
                      </ListItem>
                    </ListItemButton>
                    {comment.editView && (
                      <Box
                        component="form"
                        noValidate
                        onSubmit={handleCommentUpdateSubmit}
                        sx={{ mt: 3 }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={12}>
                            <TextField
                              value={currentComment}
                              onChange={(e) => {
                                setCurrentCommentID(comment.id);
                                setCurrentComment(e.target.value);
                              }}
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
                          Update Comment
                        </Button>
                      </Box>
                    )}
                  </div>
                ) : (
                  <ListItem
                    key={comment.id}
                    secondaryAction={
                      comment.owner ===
                        user.first_name + " " + user.last_name && (
                        <IconButton
                          edge="end"
                          aria-label="comments"
                          onClick={() => handleDeleteComment(comment.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemText
                      primary={`${comment.owner} | ${changeDate(
                        comment.updated_at
                      )}`}
                      secondary={comment.body}
                    ></ListItemText>
                  </ListItem>
                )
              )}
          </List>

          {user && (
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
