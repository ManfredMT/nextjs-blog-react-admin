import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import LeftMenu from "../components/LeftMenu";
import ChatBody from "../components/ChatBody";
import ChatFooter from "../components/ChatFooter";
import useMediaQuery from "@mui/material/useMediaQuery";

function ChatRoom({ socket, room }) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!room) {
      navigate("/");
    }
  }, [room, navigate]);
 
  let username;
  if (user) {
    username = user.name;
  }

  const welcomeMsg = {
    type: "text",
    room: room,
    author: "",
    message: room ? `${username}加入(${room})聊天室` : "",
    date: new Date().getHours() + ":" + new Date().getMinutes(),
  };
  const [messageList, setMessageList] = useState([welcomeMsg]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  useEffect(() => {
    if (room !== "") {
      socket.emit("send_message", welcomeMsg);
    } else if (room === "") {
      setMessageList([]);
    }
  }, []);

  const matchDesktop = useMediaQuery("(min-width:1200px)");


  return (
    <>
      <Grid container spacing={matchDesktop?1:0}>
        <Grid item xs={3} >
        {matchDesktop?<LeftMenu />:null}  
        </Grid>
        <Grid item xs={12} lg={9} >
          <div className="chat-window">
            <div className="chat-header">
              <p>{`实时聊天  ${room}聊天室`}</p>
            </div>
            <ChatBody messageList={messageList} username={username} />
            <ChatFooter
              room={room}
              username={username}
              socket={socket}
              setMessageList={setMessageList}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
}

export default ChatRoom;
