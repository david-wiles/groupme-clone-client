import {useState} from "react";
import Form, {FormRequestInput} from "../components/Form";
import {AuthResponse} from "../client/messages";
import {useAuth} from "../hooks/useAuth";
import {Link} from "react-router-dom";
import {doRequest} from "../client/CourierClient";

export default function Login() {
  const {login} = useAuth();

  const afterSubmit = async (resp: AuthResponse) => {
    await login(resp)
  };

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const action = "/account/login";
  const method = "POST";

  return (
    <div id={"detail"} className="login-form">
      <h1>
        Login
      </h1>
      <Form id={"login-form"}
            className={"login-form full-page"}
            method={method}
            action={action}
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
            submit={async (form: FormRequestInput) => {
              let resp = await doRequest(method, action, JSON.stringify({
                username: form["username"],
                password: form["password"]
              }));
              if (!resp.ok) {
                throw new Error(resp.status.toString())
              }
              let body: AuthResponse = await resp.json();
              return body;
            }}
            afterSubmit={afterSubmit}
      />
      <div className={"register-link"}>
        <Link to="/register">
          Create Account
        </Link>
      </div>
    </div>
  );
}
