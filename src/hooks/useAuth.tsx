import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import {AuthResponse} from "../client/messages";

const defaultAuth = {token: "", id: ""};

interface Auth {
  auth: AuthResponse
  login: (data: AuthResponse) => void,
  logout: () => void
}

const AuthContext = createContext<Auth>({
  auth: defaultAuth,
  login(data: AuthResponse) {},
  logout(): void {}
});

// @ts-ignore
export function AuthProvider({ children }) {
  const [auth, setAuth] = useLocalStorage<AuthResponse>("auth", defaultAuth);
  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data: AuthResponse) => {
    setAuth(data);
    navigate("/");
  };

  // call this function to sign out logged in user
  const logout = () => {
    setAuth(defaultAuth);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      auth,
      login,
      logout
    }),
    [auth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
