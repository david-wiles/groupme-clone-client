import {useAuth} from "../hooks/useAuth";
import {AuthResponse} from "../client/messages";
import {useState} from "react";
import Form, {FormRequestInput} from "../components/Form";
import {doRequest} from "../client/CourierClient";

export default function Register() {
  const {login} = useAuth();

  const afterSubmit = async (resp: AuthResponse) => {
    await login(resp)
  };

  const method = "POST";
  const action = "/account"

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="login-form">
      <Form id={"register-form"}
            className={"login-form"}
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
              },
              {
                displayName: "email",
                name: "email",
                type: "email",
                value: email,
                setValue: setEmail
              }
            ]}
            submit={async (form: FormRequestInput) => {
              let resp = await doRequest(method, action, JSON.stringify({
                username: form["username"],
                password: form["password"],
                email: form["email"]
              }));

              if (!resp.ok) {
                throw new Error(resp.statusText);
              }

              let body: AuthResponse = await resp.json();
              return body;
            }}
            afterSubmit={afterSubmit}
      />
    </div>
  );
}
