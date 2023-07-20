import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";

const HomePage = () => {
  let { authTokens, logoutUser } = useContext(AuthContext);
  let [exercises, setExercises] = useState([]);
  useEffect(() => {
    getExercises();
  }, []);

  let api = useAxios();

  let getExercises = async () => {
    let response = await api.get("/api/exercises/");

    if (response.status === 200) {
      setExercises(response.data);
    }
  };

  return (
    <div>
      <p>You are logged in to the home page</p>

      <ul>
        {exercises.map((exercise) => (
          <li key={exercise.id}>
            {exercise.name} | {exercise.body}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
