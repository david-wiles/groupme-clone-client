import CourierClient from "../CourierClient";

export enum ActionType {
  SET_TOKEN
}

export interface State {
  token: string
  courierClient?: CourierClient
}

export interface Action {
  type: ActionType
  payload: string
}

const getInitialState = () => {
  const token = window.localStorage.getItem("token") || "";
  const courierClient: CourierClient | undefined = token ? new CourierClient(token) : undefined;

  return {
    token, courierClient
  } as State
};

export const initialState = getInitialState();

export const Reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.SET_TOKEN:
      // Save token to local storage
      localStorage.setItem("token", action.payload);

      // Create client
      const client = new CourierClient(action.payload);

      return {
        ...state,
        token: action.payload,
        courierClient: client
      };
    default:
      return state;
  }
}
