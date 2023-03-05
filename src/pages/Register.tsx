import {useAuth} from "../hooks/useAuth";
import {AuthResponse} from "../client/messages";
import {useState} from "react";
import Form from "../components/Form";

export default function Register() {
  const {login} = useAuth();

  const handleResponse = async (resp: Response) => {
    if (resp.ok) {
      let body: AuthResponse = await resp.json();
      await login(body)
    }
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="login-form">
      <Form id={"register-form"}
            className={"login-form"}
            method="POST"
            action="http://localhost:9000/account"
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
              },
              {
                displayName: "email",
                name: "email",
                type: "email",
                value: email,
                setValue: setEmail
              }
            ]}
            afterSubmit={handleResponse}
      />
    </div>
  );
}
