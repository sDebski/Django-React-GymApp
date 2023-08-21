import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { useParams } from "react-router-dom";
import React from "react";
import {
  Routes,
  Route,
  useSearchParams,
  BrowserRouter,
} from "react-router-dom";
import { createContext, useState, useEffect } from "react";

const EmailVerificationPage = () => {
  const [queryParameters] = useSearchParams();
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    let email = queryParameters.get("emailVerified");
    if (email == "true") setEmailVerified(true);
    else setEmailVerified(false);
  });

  return (
    <div>
      {emailVerified ? (
        <p>Email has been succesfully verified! You can now log in!</p>
      ) : (
        <p>Something went wrong...</p>
      )}
    </div>
  );
};

export default EmailVerificationPage;
