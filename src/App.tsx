import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Root from "./pages/Root";
import Login from "./pages/Login";
import ChatRoom from "./pages/ChatRoom";
import RoomListMobile from "./pages/RoomListMobile";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login/>}/>
        <Route path="/" element={<Root/>}>
          <Route path="/rooms" element={<RoomListMobile/>}/>
          <Route path="/room/:id" element={<ChatRoom/>}/>
        </Route>
    </Routes>
  );
}

export default App;
