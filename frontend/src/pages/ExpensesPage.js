import React, { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "react-datepicker/dist/react-datepicker.css";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { green, grey } from "@mui/material/colors";

const defaultTheme = createTheme();

const ExpensesPage = () => {
  let [categoryExpenses, setCategoryExpenses] = useState([]);
  let [allExpenses, setAllExpenses] = useState([]);
  let [next, setNext] = useState(null);
  let [previous, setPrevious] = useState(null);
  const [currentExpenseDescription, setCurrentExpenseDescription] =
    useState("");

  const [currentTimePeriod, setCurrentTimePeriod] = useState("");
  const [currentExpenseID, setCurrentExpenseID] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("GYM_MEMBERSHIP");
  const changeCategory = (newCategory) => {
    setCurrentCategory(newCategory);
  };

  const changeTimePeriod = (newTimePeriod) => {
    setCurrentTimePeriod(newTimePeriod);
  };

  const handleCategoryExpenseSearch = (event) => {
    event.preventDefault();
    getCategoryExpenses();
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
    if (currentTimePeriod !== "") {
      let response = await api.get(
        `userstats/expense-category/${currentTimePeriod}/`
      );
      if (response.status === 200) {
        let data = response.data.data;
        if (data.category_data.length > 0) {
          setCategoryExpenses(data.category_data);
        }
      }
    } else setCategoryExpenses([]);
  };

  let getAllExpenses = async (page = "") => {
    let response = await api.get("expenses/" + page);
    if (response.status === 200) {
      let data = response.data;
      if (data.results.length > 0) {
        setAllExpenses(addEditValueForEachExpense(data.results));
        setNext(data.next);
        setPrevious(data.previous);
      }
    }
  };

  const addEditValueForEachExpense = (data) => {
    let result = data;
    result.map((el) => (el["editView"] = false));
    return result;
  };

  const addExpense = async (data) => {
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
      document.getElementById("add_expense_form").reset();
    } else {
      alert("Something went wrong!");
    }
  };

  let handleDeleteExpense = async (id) => {
    let response = await api.delete(`expenses/${id}`);
    if (response.status === 204) {
      getAllExpenses();
      getCategoryExpenses();
      alert("You have succesfully deleted the expense!");
    }
  };
  const handlePageChange = async (page) => {
    let page_data = page.split("?")[1];
    getAllExpenses("?" + page_data);
  };

  const changeEditViewOnItem = (id) => {
    let result = structuredClone(allExpenses);
    result.map((el) => {
      if (el.id === id) {
        if (!el.editView) setCurrentExpenseDescription(el.description);
        el.editView = !el.editView;
      } else el.editView = false;
    });
    setCurrentExpenseID(id);
    setAllExpenses(result);
  };

  const handleExpenseUpdateSubmit = (event) => {
    event.preventDefault();
    updateExpense();
  };

  const updateExpense = async () => {
    let response = await api.patch(`expenses/${currentExpenseID}/`, {
      description: currentExpenseDescription,
    });
    if (response.status === 200) {
      getCategoryExpenses();
      getAllExpenses();
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
          <Grid container spacing={1}>
            <Grid item xs={6} sm={2}>
              <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                <AttachMoneyIcon />
              </Avatar>
            </Grid>
            <Grid item xs={6} sm={10}>
              <Typography variant="h5">Category Expenses</Typography>
            </Grid>
          </Grid>
          <Box
            component="form"
            id="add_expense_form"
            noValidate
            onSubmit={handleCategoryExpenseSearch}
            sx={{ mt: 3 }}
          >
            <select
              required
              onChange={(event) => changeTimePeriod(event.target.value)}
              value={currentTimePeriod}
            >
              <option value="">----</option>
              <option value="day">1 DAY</option>
              <option value="year">1 YEAR</option>
            </select>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Search
            </Button>
          </Box>

          {categoryExpenses.map((expense) => (
            <nav aria-label="secondary mailbox folders">
              <List>
                <ListItem key={expense.id} disablePadding>
                  <ListItemText
                    primary={expense.category}
                    secondary={`${expense.amount}$`}
                  />
                </ListItem>
              </List>
            </nav>
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
                      aria-label="expenses"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    onClick={() => changeEditViewOnItem(expense.id)}
                  >
                    <ListItemText
                      primary={`${expense.category} | ${expense.amount}$`}
                      secondary={`${expense.date} | ${expense.description}`}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
              {expense.editView && (
                <Box
                  id="expense_form"
                  component="form"
                  noValidate
                  onSubmit={handleExpenseUpdateSubmit}
                  sx={{ mt: 3 }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12}>
                      <TextField
                        value={currentExpenseDescription}
                        onChange={(e) => {
                          setCurrentExpenseID(expense.id);
                          setCurrentExpenseDescription(e.target.value);
                        }}
                        required
                        fullWidth
                        id="description"
                        label="Description"
                        name="description"
                        autoComplete="description"
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Update Expense
                  </Button>
                </Box>
              )}
            </nav>
          ))}
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={2} sm={6}>
                <IconButton
                  edge="end"
                  aria-label="expenses"
                  disabled={previous ? false : true}
                  onClick={() => handlePageChange(previous)}
                >
                  <Avatar
                    sx={{ m: 1, bgcolor: previous ? green[500] : grey[500] }}
                  >
                    <ChevronLeftIcon />
                  </Avatar>
                </IconButton>
              </Grid>
              <Grid item xs={2} sm={6}>
                <IconButton
                  disabled={next ? false : true}
                  edge="end"
                  aria-label="expenses"
                  onClick={() => handlePageChange(next)}
                >
                  <Avatar sx={{ m: 1, bgcolor: next ? green[500] : grey[500] }}>
                    <ChevronRightIcon />
                  </Avatar>
                </IconButton>
              </Grid>
            </Grid>
          </Box>
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
            id="add_expense_form"
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
                  <option value="PERSONAL_TRAINER">PERSONAL TRAINER</option>
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
