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

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Header />
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
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
