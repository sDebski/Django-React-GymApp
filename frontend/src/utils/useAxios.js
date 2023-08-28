import axios from "axios";
import jwt_decode from "jwt-decode";
import dayjs from "dayjs";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const baseURL = "http://127.0.0.1:8000/";

const useAxios = () => {
  const { tokens, setUser, setTokens } = useContext(AuthContext);

  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Authorization: `Bearer ${tokens?.access}`,
    },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    const user = jwt_decode(tokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;
    if (!isExpired) return req;

    const response = await axios.post(`${baseURL}users/token-refresh/`, {
      refresh: tokens.refresh,
    });

    localStorage.setItem("tokens", JSON.stringify(response.data.tokens));
    localStorage.setItem("user", JSON.stringify(response.data.user));

    setTokens(response.data.tokens);
    setUser(response.data.user);

    req.headers.Authorization = `Bearer ${response.data.tokens.access}`;
    return req;
  });

  return axiosInstance;
};

export default useAxios;
