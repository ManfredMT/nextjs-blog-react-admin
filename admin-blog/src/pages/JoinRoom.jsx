import React,{useEffect} from 'react'
import {useNavigate,} from 'react-router-dom'
import {useSelector} from 'react-redux'

import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function JoinRoom(props) {

    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        
        if (!user) {
          navigate("/login");
        }
    
      }, [user, navigate, ]);
    
    let username;
    if(user) {
        username=user.name;
    }
    
    const room=props.room;
    
    const socket=props.socket;
    //const setUsername=props.setUsername;
    const setRoom=props.setRoom;

    


  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get('chatRoom'));
    if (username !== "" && room !== "") {
      socket.emit("join_room", {room,username});
      navigate("/chatRoom");
    }

  };

  return (
      <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <GroupsRoundedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            加入聊天
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="chatRoom"
              label="房间号..."
              name="chatRoom"
              autoComplete="chat-room"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              onKeyPress={(e) => {
            if (e.key === "Enter") {   
              handleSubmit();
            }
          }}
            />
            
      
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              加入聊天室
            </Button>
            
          </Box>
        </Box>
        
      </Container>
    
      
    </>
  );
}

export default JoinRoom