import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import SearchComponent from "../components/SearchComponent";
import UserHitComponent from "../components/UserHitComponent";

const ChatPage = () => {
  let { tokens, logoutUser } = useContext(AuthContext);
  useEffect(() => {}, []);
  const searchingObject = {
    index: "skwde_User",
    hitComponent: UserHitComponent,
  };

  let api = useAxios();

  return (
    <div>
      <p>Chat Page</p>
      <SearchComponent searchingObject={searchingObject} />
    </div>
  );
};

export default ChatPage;
