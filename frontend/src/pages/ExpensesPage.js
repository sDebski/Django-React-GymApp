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
import { IconButton } from "@mui/material";

const defaultTheme = createTheme();

const ExpensesPage = () => {
  let baseURL = "http://127.0.0.1:8000/";
  let [categoryExpenses, setCategoryExpenses] = useState([]);
  let [allExpenses, setAllExpenses] = useState([]);
  const [currentCategory, setCurrentCategory] = useState("GYM_MEMBERSHIP");
  const changeCategory = (newCategory) => {
    setCurrentCategory(newCategory);
  };
  let api = useAxios();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const submitData = {
      category: currentCategory,
      amount: data.get("amount"),
      description: data.get("description"),
      date: data.get("date_of_expense"),
    };

    if (isNaN(+submitData.amount)) {
      alert("Amount has to be a valid number");
      return;
    }
    addExpense(submitData);
  };

  let getCategoryExpenses = async () => {
    console.log("Biore categories");
    let response = await api.get("userstats/expense-category");
    if (response.status === 200) {
      let data = response.data.data;
      if (data.category_data.length > 0) {
        console.log("getCategoryExpenses", data.category_data);
        setCategoryExpenses(data.category_data);
      }
    }
  };

  let getAllExpenses = async () => {
    let response = await api.get("expenses/");
    if (response.status === 200) {
      let data = response.data;
      console.log("getAllExpenses", data);
      if (data.length > 0) {
        setAllExpenses(data);
      }
    }
  };

  const addExpense = async (data) => {
    console.log(data);
    let response = await api.post("expenses/", {
      category: data["category"],
      amount: data["amount"],
      description: data["description"],
      date: data["date"],
    });
    if (response.status === 201) {
      alert("Expense has been successfully added!");
      getCategoryExpenses();
      getAllExpenses();
    } else {
      alert("Something went wrong!");
    }
  };

  let handleDeleteExpense = async (id) => {
    console.log("Usuwam expense o id", id);
    let response = await api.delete(`expenses/${id}`);
    if (response.status === 204) {
      getAllExpenses();
      getCategoryExpenses();
      alert("You have succesfully deleted the expense!");
    }
  };

  useEffect(() => {
    getCategoryExpenses();
    getAllExpenses();
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} sm={2}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <AttachMoneyIcon />
              </Avatar>
            </Grid>
            <Grid item xs={6} sm={10}>
              <Typography variant="h5">Category Expenses</Typography>
            </Grid>
          </Grid>
          {categoryExpenses.map((expense) => (
            <React.Fragment key={expense.category}>
              <Grid item xs={6} sm={6}>
                <Typography variant="h8">
                  {expense.category} | {expense.amount} $
                </Typography>
              </Grid>
            </React.Fragment>
          ))}
        </Box>
        <Divider />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={6} sm={2}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <FormatListBulletedIcon />
              </Avatar>
            </Grid>
            <Grid item xs={6} sm={10}>
              <Typography variant="h5">All Expenses</Typography>
            </Grid>
          </Grid>
          {allExpenses.map((expense) => (
            <nav aria-label="secondary mailbox folders">
              <List>
                <ListItem
                  key={expense.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="comments"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => alert(`Description: ${expense.description}`)}
                  >
                    <ListItemText
                      primary={`${expense.category} | ${expense.amount}$`}
                      secondary={expense.date}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          ))}
        </Box>
        <CssBaseline />
        <Divider />
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
              <Typography component="h1" variant="h5">
                Add Expense
              </Typography>
            </Grid>
          </Grid>

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={6} sm={6}>
                <select
                  required
                  onChange={(event) => changeCategory(event.target.value)}
                  value={currentCategory}
                >
                  <option value="GYM_MEMBERSHIP">GYM MEMBERSHIP</option>
                  <option value="GYM_GEAR">GYM GEAR</option>
                  <option value="FOOD">FOOD</option>
                  <option value="FOOPERSONAL_TRAINER">PERSONAL TRAINER</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </Grid>
              <Grid item xs={6} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="amount"
                  label="Amount"
                  name="amount"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="description"
                />
              </Grid>
              <Grid item xs={12}>
                <span>Date of Expense</span>
                <TextField
                  required
                  fullWidth
                  name="date_of_expense"
                  type="date"
                  id="date_of_expense"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Expense
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ExpensesPage;
