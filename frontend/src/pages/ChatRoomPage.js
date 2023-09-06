import React, { useEffect, useState } from "react";
import useAxios from "../utils/useAxios";
import { useParams } from "react-router";
import "react-datepicker/dist/react-datepicker.css";
import Pusher from "pusher-js";

const ChatRoomPage = () => {
  let api = useAxios();
  const { id, first_name, last_name } = useParams();
  const [chat, setChat] = useState(`${id}-${first_name}-${last_name}`);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  useEffect(() => {
    Pusher.logToConsole = false;

    const pusher = new Pusher("af6db88506191819a56e", {
      cluster: "eu",
    });
    const channel = pusher.subscribe(`${id}-${first_name}-${last_name}`);
    channel.bind("message", function (data) {
      setReceivedMessage(() => data);
    });
  }, []);

  useEffect(() => {
    if (receivedMessage) setMessages([...messages, receivedMessage]);
  }, [receivedMessage]);

  const submit = async (e) => {
    e.preventDefault();
    await api
      .post("chat/messages/", {
        chat: chat,
        body: message,
      })
      .then((response) => {
        if (response.status === 201) {
        }
      })
      .catch((e) => {
        alert("Something went wrong!");
      });

    setMessage("");
  };

  return (
    <div className="container">
      <div
        className="d-flex flex-column align-items-stretch flex-shrink-0 bg-white"
        style={{ minHeight: "500px" }}
      >
        <div className="d-flex align-items-center flex-shrink-0 p-3 link-dark text-decoration-none border-bottom"></div>
        <div className="list-group list-group-flush border-bottom scrollarea">
          {messages.map((message) => {
            return (
              <div className="list-group-item list-group-item-action py-3 lh-tight">
                <div className="d-flex w-100 align-items-center justify-content-between">
                  <strong className="mb-1">{message.username}</strong>
                  <p>{message.created_at}</p>
                </div>
                <div className="col-10 mb-1 small">{message.message}</div>
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={(e) => submit(e)}>
        <input
          className="form-control"
          placeholder="Write a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
};

export default ChatRoomPage;
