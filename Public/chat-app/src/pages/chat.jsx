import React, { useEffect, useState ,useRef} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Contacts from '../components/Contacts.jsx';
import { allUserRoute,host } from '../utils/APIRoutes';
import ChatContainer from '../components/ChatContainer.jsx';
import Welcome from '../components/Welcome.jsx';
import {io} from "socket.io-client";

const Chat = () => {

  const socket = useRef();
  const nav = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem('chat-app-user')) {
        nav('/');
      }
    }
    fetchData();
  },[]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  useEffect(() => {
    async function fetchData() {
      if (!localStorage.getItem('chat-app-user')) {
        nav('/login');
      }
      else {
        setCurrentUser(JSON.parse(localStorage.getItem('chat-app-user')));
      }
    }
    fetchData();
  });

  useEffect(() => {
    async function fetchData() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const data = await axios.get(`${allUserRoute}/${currentUser._id}`);
          setContacts(data.data);
        } else {
          nav('/setAvatar')
        }
      }
    }
    fetchData();
  },[currentUser]);
  
  const handleChatChange = (chat)=>{
    setCurrentChat(chat);
  }

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {currentChat === undefined ? (<Welcome currentUser={currentUser} /> ):
        ( 
          <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket} />
        )};
      </div>      
    </Container>
  );
};

const Container = styled.div`
  display: flex; 
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;background-color: #131324;
  .container{
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width:720px) and (max-width:1080px){
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat