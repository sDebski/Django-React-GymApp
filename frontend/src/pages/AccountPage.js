import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";

const AccountPage = () => {
  let { tokens, logoutUser } = useContext(AuthContext);
  let [exercises, setExercises] = useState([]);
  useEffect(() => {
    getExercises();
  }, []);

  let api = useAxios();

  let getExercises = async () => {
    // let response = await api.get("/exercises/");
    // if (response.status === 200) {
    //   setExercises(response.data);
    // }
  };

  return (
    <div>
      <p>Account</p>
    </div>
  );
};

export default AccountPage;
