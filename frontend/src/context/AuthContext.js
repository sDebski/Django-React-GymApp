import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let baseURL = "http://127.0.0.1:8000/accounts/";

  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? localStorage.getItem("authTokens").first_name
      : null
  );

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
      setAuthTokens(data);
      console.log(data);
      setUser(data.first_name);
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      alert("Something went wrong!");
    }
  };

  let registerUser = async (data) => {
    console.log("registration page data: ", data);
    console.log("registration page first name data: ", data["first_name"]);

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
      }),
    });

    if (response.status === 201) {
      navigate("/login");
    } else {
      alert("Something went wrong!");
    }
  };

  let logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/login");
  };

  let contextData = {
    user: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    authTokens: authTokens,
    setAuthTokens: setAuthTokens,
    setUser: setUser,
    registerUser: registerUser,
  };

  useEffect(() => {
    if (authTokens) {
      setUser(authTokens.first_name);
    }

    setLoading(false);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
