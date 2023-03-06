import {useState} from "react";
import Form from "../components/Form";
import {AuthResponse} from "../client/messages";
import {useAuth} from "../hooks/useAuth";
import {Link} from "react-router-dom";

export default function Login() {
  const {login} = useAuth();

  const handleResponse = async (resp: Response) => {
    if (resp.ok) {
      let body: AuthResponse = await resp.json();
      await login(body)
    }
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="login-form">
      <Form id={"login-form"}
            className={"login-form"}
            method="POST"
            action="/account/login"
            inputs={[
              {
                displayName: "username",
                name: "username",
                type: "text",
                value: username,
                setValue: setUsername,
              },
              {
                displayName: "password",
                name: "password",
                type: "password",
                value: password,
                setValue: setPassword,
              }
            ]}
            afterSubmit={handleResponse}
      />
      <div className={"register-link"}>
        <Link to="/register">
          Create Account
        </Link>
      </div>
    </div>
  );
}
