import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

const HomePage = () => {
  let { authTokens, logoutUser } = useContext(AuthContext);
  let [exercises, setExercises] = useState([]);
  useEffect(() => {
    getExercises();
  }, []);

  let getExercises = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/exercises/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });

    let data = await response.json();

    if (response.status === 200) {
      setExercises(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
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
