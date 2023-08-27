import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Header from "./components/Header";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import RegisterPage from "./pages/RegistrationPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordCompletePage from "./pages/ResetPasswordCompletePage";
import ResetPasswordNewPasswordPage from "./pages/ResetPasswordNewPasswordPage";
import Navbar from "./components/Navbar";
import ExpensesPage from "./pages/ExpensesPage";
import ProfilePage from "./pages/ProfilePage";
import AccountPage from "./pages/AccountPage";
import DashboardPage from "./pages/DashboardPage";
import ExercisesPage from "./pages/ExercisesPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route exact path="/" element={<PrivateRoute />}>
              <Route exact path="/" element={<HomePage />} />
            </Route>
            <Route Component={LoginPage} path="login/" />
            <Route Component={RegisterPage} path="register/" />
            <Route
              Component={EmailVerificationPage}
              path="email-verification/"
            />
            <Route Component={ResetPasswordPage} path="reset-password/" />
            <Route
              Component={ResetPasswordCompletePage}
              path="reset-password-complete/"
            />
            <Route
              Component={ResetPasswordNewPasswordPage}
              path="reset-password-new-password/"
            />
            <Route Component={ExpensesPage} path="expenses/" />
            <Route Component={ProfilePage} path="profile/" />
            <Route Component={AccountPage} path="account/" />
            <Route Component={DashboardPage} path="dashboard/" />
            <Route Component={ExercisesPage} path="exercises/" />
            <Route Component={ChatPage} path="chat/" />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
