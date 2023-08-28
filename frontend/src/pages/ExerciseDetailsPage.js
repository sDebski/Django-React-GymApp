import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import useAxios from "../utils/useAxios";
import { useParams } from "react-router";

const ExerciseDetailsPage = () => {
  const { id } = useParams();
  const [exercise, setExercise] = useState({});
  const baseURL = "http://127.0.0.1:8000/exercises/";

  const getExerciseDetail = async () => {
    let response = await fetch(baseURL + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let data = await response.json();
    if (response.status === 200) {
      setExercise(data);
      console.log(data);
    }
  };
  useEffect(() => {
    getExerciseDetail();
  }, []);

  return (
    <div>
      <p>Exercise details {id}</p>
      <p>{exercise?.owner}</p>
    </div>
  );
};

export default ExerciseDetailsPage;
