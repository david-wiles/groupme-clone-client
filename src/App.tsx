import React, {createContext, useState} from 'react';
import './App.css';
import Client from "./pages/Client";
import Login from "./pages/Login";
import CourierClient from "./CourierClient";


export interface Global {
  courierClient?: CourierClient
  selfId: string
}

export const GlobalContext = createContext<Global>({selfId:""});

function App() {
  const token = window.localStorage.getItem("token");

  const [courierClient, setCourierClient] = useState<CourierClient|undefined>(
    token ? new CourierClient(token) : undefined
  );
  const [selfId, setSelfId] = useState<string>(window.localStorage.getItem("selfId") || "");


  return (
    <div className="App">
      <GlobalContext.Provider value={{courierClient, selfId}}>
        {
          courierClient ?
            <Client /> :
            <Login setToken={(t) => setCourierClient(new CourierClient(t.toString()))}
                   setSelfId={(id) => setSelfId(id.toString)}/>
        }
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
