import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import SearchComponent from "../components/SearchComponent";

const ChatPage = () => {
  let { tokens, logoutUser } = useContext(AuthContext);
  useEffect(() => {}, []);

  let api = useAxios();

  return (
    <div>
      <p>Chat Page</p>
      <SearchComponent />
    </div>
  );
};

export default ChatPage;
