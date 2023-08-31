import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let baseURL = "http://127.0.0.1:8000/users/";

  let [tokens, setTokens] = useState(() =>
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens"))
      : null
  );
  let [user, setUser] = useState(() => {
    return localStorage.getItem("user") ? localStorage.getItem("user") : null;
  });

  let [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    let response = await fetch(baseURL + "login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setTokens(data.tokens);
      setUser(data.user);
      localStorage.setItem("tokens", JSON.stringify(data.tokens));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert("Something went wrong!");
    }
  };

  const loginWithGoogle = async (credentialResponse) => {
    console.log(credentialResponse);
    console.log(credentialResponse.credential);
    let response = await fetch("http://127.0.0.1:8000/social_auth/google/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        auth_token: credentialResponse.credential,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setTokens(data.tokens);
      setUser(data.user);
      localStorage.setItem("tokens", JSON.stringify(data.tokens));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } else {
      alert("Something went wrong!");
    }
  };

  let registerUser = async (data) => {
    let response = await fetch(baseURL + "register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: data["first_name"],
        last_name: data["last_name"],
        password: data["password"],
        password2: data["password2"],
        date_of_birth: data["date_of_birth"],
        email: data["email"],
        redirect_url: "http://localhost:3000/email-verification",
      }),
    });

    if (response.status === 201) {
      alert("An activation mail was send to your mail account!");
      navigate("/login");
    } else {
      alert("Something went wrong!");
    }
  };

  let logoutUser = () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem("tokens");
    localStorage.removeItem("user");
    navigate("/login");
  };

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    tokens: tokens,
    setTokens: setTokens,
    setUser: setUser,
    registerUser: registerUser,
    loginWithGoogle: loginWithGoogle,
  };

  useEffect(() => {
    console.log(loading);
    console.log("UseEffect auth COntext");
    setUser(() =>
      localStorage.getItem("user") ? localStorage.getItem("user") : null
    );
    console.log(user);
    setTokens(() =>
      localStorage.getItem("tokens")
        ? JSON.parse(localStorage.getItem("tokens"))
        : null
    );
    console.log(tokens);
    setLoading(() => false);
  }, [loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
