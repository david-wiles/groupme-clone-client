import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import Default from "./pages/Default";
import NewRoom from "./pages/NewRoom";
import Register from "./pages/Register";
import JoinRoom from "./pages/JoinRoom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/" element={<Default/>}/>
      <Route path={"/room/new"} element={<NewRoom/>}/>
      <Route path="/room/:id" element={<ChatRoom/>}/>
      <Route path="/join/:id" element={<JoinRoom/>}/>
    </Routes>
  );
}

export default App;
