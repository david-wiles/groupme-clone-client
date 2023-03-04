import { createContext, useContext, useMemo } from "react";
import CourierClient from "../client/CourierClient";
import {useAuth} from "./useAuth";

interface Client {
  courier: CourierClient
}

const ClientContext = createContext<Client>({
  courier: new CourierClient("")
});

// @ts-ignore
export function ClientProvider({ children }) {
  const {auth} = useAuth();
  const value = useMemo(
    () => ({
      courier: new CourierClient(auth.token)
    }),
    [auth]
  );
  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
}

export const useClient = () => {
  return useContext(ClientContext);
};
