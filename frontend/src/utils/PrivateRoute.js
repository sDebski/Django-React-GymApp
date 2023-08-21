import { Route, Redirect } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const PrivateRoute = () => {
  let { user } = useContext(AuthContext);
  const auth = false;
  console.log("user=", user);
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
