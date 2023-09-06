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
import Pusher from "pusher-js";

const defaultTheme = createTheme();

const ChatRoomPage = () => {
  const [comments, setComments] = useState([]);
  let api = useAxios();
  let { user } = useContext(AuthContext);
  const { id, first_name, last_name } = useParams();
  const [exercise, setExercise] = useState({});
  const [currentComment, setCurrentComment] = useState("");
  const [currentCommentID, setCurrentCommentID] = useState(null);
  const baseURL = "http://127.0.0.1:8000/api/exercises/";
  const navigate = useNavigate();
  const [likeDislike, setLikeDislike] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [chat, setChat] = useState(`${id}-${first_name}-${last_name}`);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  let allMessages = [];

  useEffect(() => {
    Pusher.logToConsole = false;

    const pusher = new Pusher("af6db88506191819a56e", {
      cluster: "eu",
    });
    const channel = pusher.subscribe(`${id}-${first_name}-${last_name}`);
    channel.bind("message", function (data) {
      console.log("Dostaje wiadomosc!");
      setReceivedMessage(() => data);
    });
  }, []);

  useEffect(() => {
    if (receivedMessage) setMessages([...messages, receivedMessage]);
  }, [receivedMessage]);

  const submit = async (e) => {
    e.preventDefault();
    await api
      .post("chat/messages/", {
        chat: chat,
        body: message,
      })
      .then((response) => {
        if (response.status == 201) {
          console.log("Message added");
        }
      })
      .catch((e) => {
        alert("Something went wrong!");
      });

    setMessage("");
  };

  /*
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  */

  //   let handleDeleteExercise = async (id) => {
  //     let response = await api.delete(`exercises/${id}`);
  //     if (response.status === 204) {
  //       alert("You have succesfully deleted the expense!");
  //       navigate("/exercises/");
  //     } else alert("Something went wrong!");
  //   };

  //   const getExerciseDetail = async () => {
  //     let response = await fetch(baseURL + id, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     let data = await response.json();
  //     if (response.status === 200) {
  //       setExercise(data);
  //       setLoaded(true);
  //       // console.log(data);
  //     }
  //   };

  //   const getAllComments = async () => {
  //     let response = await fetch(baseURL + `${id}/comment`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     let data = await response.json();
  //     if (response.status === 200) {
  //       let new_data = addEditValueForEachComment(data.results);
  //       setComments(new_data);
  //     }
  //   };

  //   const addEditValueForEachComment = (data) => {
  //     let result = data;
  //     result.map((el) => (el["editView"] = false));
  //     return result;
  //   };

  //   const handleCommentAddSubmit = (event) => {
  //     event.preventDefault();
  //     const data = new FormData(event.currentTarget);
  //     const body = data.get("body");
  //     addComment(body);
  //   };

  //   const handleCommentUpdateSubmit = (event) => {
  //     event.preventDefault();
  //     updateComment();
  //   };

  //   const updateComment = async () => {
  //     let response = await api.put(
  //       `exercises/${id}/comment/${currentCommentID}/`,
  //       {
  //         exercise: id,
  //         body: currentComment,
  //       }
  //     );
  //     if (response.status == 200) {
  //       getExerciseDetail();
  //       getAllComments();
  //     }
  //   };

  //   const addComment = async (body) => {
  //     let response = await api.post(`exercises/${id}/comment/`, {
  //       exercise: id,
  //       body: body,
  //     });
  //     if (response.status == 201) {
  //       getExerciseDetail();
  //       getAllComments();
  //       document.getElementById("comment_add_form").reset();
  //     }
  //   };

  //   const handleLikeDislikeButton = async () => {
  //     let response = await api.get(`exercises/like/${id}`);
  //     if (response.status === 200) {
  //       setLikeDislike(!likeDislike);
  //       getExerciseDetail();
  //     }
  //   };
  //   const checkIfExerciseLikedByUser = () => {
  //     let result = false;
  //     for (let i = 0; i < exercise.likes?.length; i++) {
  //       if (
  //         exercise.likes[i][0] == user.first_name &&
  //         exercise.likes[i][1] == user.last_name
  //       ) {
  //         result = true;
  //         break;
  //       }
  //     }
  //     setLikeDislike(result);
  //   };

  //   const handleDeleteComment = async (comment_id) => {
  //     let response = await api.delete(`exercises/${id}/comment/${comment_id}/`);
  //     if (response.status === 204) {
  //       alert("You succesfully deleted the comment!");
  //       getAllComments();
  //     }
  //   };

  //   const changeEditViewOnItem = (id) => {
  //     let result = structuredClone(comments);
  //     result.map((el) => {
  //       if (el.id === id) {
  //         if (!el.editView) setCurrentComment(el.body);
  //         el.editView = !el.editView;
  //       } else el.editView = false;
  //     });
  //     setCurrentCommentID(id);
  //     setComments(result);
  //   };

  //   const changeDate = (date) => {
  //     let date_splitted = date.slice(0, 19).split("T");
  //     return `${date_splitted[0]} ${date_splitted[1]}`;
  //   };

  //   useEffect(() => {
  //     getExerciseDetail();
  //     if (loaded) {
  //       checkIfExerciseLikedByUser();
  //     }
  //     getAllComments();
  //   }, [loaded]);

  return (
    <div className="container">
      <div
        className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white"
        style={{ minHeight: "500px" }}
      >
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom"></div>
        <div className="list-group list-group-flush border-bottom scrollarea">
          {messages.map((message) => {
            return (
              <div className="list-group-item list-group-item-action py-3 lh-tight">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{message.username}</strong>
                  <p>{message.created_at}</p>
                </div>
                <div className="col-10 mb-1 small">{message.message}</div>
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={(e) => submit(e)}>
        <input
          className="form-control"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
    // <ThemeProvider theme={defaultTheme}>
    //   <CssBaseline />
    //   <Container component="main" maxWidth="xs">
    //     <Box
    //       sx={{
    //         marginTop: 1,
    //         display: "flex",
    //         flexDirection: "column",
    //         alignItems: "center",
    //       }}
    //     >
    //       <Typography gutterBottom variant="h6">
    //         Chat Participants:
    //       </Typography>
    //       <Typography>
    //         {user.first_name + " " + user.last_name} |{" "}
    //         {"ID: " + id + " " + first_name + " " + last_name}
    //       </Typography>
    //       <Typography>{exercise.body}</Typography>
    //       <Divider />
    //       <List>
    //         {comments &&
    //           comments.map((comment) =>
    //             comment.owner === user.first_name + " " + user.last_name ? (
    //               <div>
    //                 <ListItemButton
    //                   onClick={() => changeEditViewOnItem(comment.id)}
    //                 >
    //                   <ListItem
    //                     key={comment.id}
    //                     secondaryAction={
    //                       comment.owner ===
    //                         user.first_name + " " + user.last_name && (
    //                         <IconButton
    //                           edge="end"
    //                           aria-label="comments"
    //                           onClick={() => handleDeleteComment(comment.id)}
    //                         >
    //                           <DeleteIcon />
    //                         </IconButton>
    //                       )
    //                     }
    //                   >
    //                     <ListItemText
    //                       primary={`${comment.owner} | ${changeDate(
    //                         comment.updated_at
    //                       )}`}
    //                       secondary={comment.body}
    //                     ></ListItemText>
    //                   </ListItem>
    //                 </ListItemButton>
    //               </div>
    //             ) : (
    //               <ListItem
    //                 key={comment.id}
    //                 secondaryAction={
    //                   comment.owner ===
    //                     user.first_name + " " + user.last_name && (
    //                     <IconButton
    //                       edge="end"
    //                       aria-label="comments"
    //                       onClick={() => handleDeleteComment(comment.id)}
    //                     >
    //                       <DeleteIcon />
    //                     </IconButton>
    //                   )
    //                 }
    //               >
    //                 <ListItemText
    //                   primary={`${comment.owner} | ${changeDate(
    //                     comment.updated_at
    //                   )}`}
    //                   secondary={comment.body}
    //                 ></ListItemText>
    //               </ListItem>
    //             )
    //           )}
    //       </List>

    //       {user && (
    //         <Box
    //           sx={{
    //             marginTop: 8,
    //             display: "flex",
    //             flexDirection: "column",
    //             alignItems: "center",
    //           }}
    //         >
    //           <Grid container spacing={2}>
    //             <Grid item xs={2} sm={2}>
    //               <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
    //                 <AddIcon />
    //               </Avatar>
    //             </Grid>
    //           </Grid>

    //           <Box
    //             component="form"
    //             id="comment_add_form"
    //             noValidate
    //             onSubmit={handleCommentAddSubmit}
    //             sx={{ mt: 3 }}
    //           >
    //             <Grid container spacing={2}>
    //               <Grid item xs={12} sm={12}>
    //                 <TextField
    //                   required
    //                   fullWidth
    //                   id="body"
    //                   label="Content"
    //                   name="body"
    //                   autoComplete="body"
    //                 />
    //               </Grid>
    //             </Grid>
    //             <Button
    //               type="submit"
    //               fullWidth
    //               variant="contained"
    //               sx={{ mt: 3, mb: 2 }}
    //             >
    //               Send Message
    //             </Button>
    //           </Box>
    //         </Box>
    //       )}
    //     </Box>
    //     <Divider />
    //   </Container>
    // </ThemeProvider>
  );
};

export default ChatRoomPage;
