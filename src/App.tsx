import React, {createContext, useReducer} from 'react';
import './App.css';
import Client from "./pages/Client";
import Login from "./pages/Login";
import {ActionType, initialState, Reducer} from "./hooks/Reducer";

export const AppContext = createContext(initialState);

function App() {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <div className="App">
      <AppContext.Provider value={state}>
        {
          state.token === "" ?
            <Login setToken={(t) => dispatch({type: ActionType.SET_TOKEN, payload: t.toString()})}/> :
            <Client />
        }
      </AppContext.Provider>
    </div>
  );
}

export default App;
