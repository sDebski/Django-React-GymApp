import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
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
import ExercisesPage from "./pages/ExercisesPage";
import ChatPage from "./pages/ChatPage";
import ExerciseDetailsPage from "./pages/ExerciseDetailsPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import ChatRoomPage from "./pages/ChatRoomPage";

function App() {
  return (
    <div className="App">
      <Router>
        <GoogleOAuthProvider clientId="538718943719-ismmor4emirsq68ofhqcb80413ngh9f6.apps.googleusercontent.com">
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
              <Route Component={ExercisesPage} path="exercises/" />
              <Route Component={ChatPage} path="chat/" />
              <Route
                Component={ExerciseDetailsPage}
                path="exercise/details/:id"
              />
              <Route
                Component={ChatRoomPage}
                path="chat/room/:id/:first_name/:last_name/"
              />
            </Routes>
          </AuthProvider>
        </GoogleOAuthProvider>
      </Router>
    </div>
  );
}

export default App;
