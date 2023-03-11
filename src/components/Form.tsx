import React, {FormEvent, FormEventHandler, useState} from "react";

const NOT_SUBMITTED = 0;
const SUBMITTED = 1;
const SUCCESS = 2;
const FAILURE = 3;

export type FormRequestInput = { [k: string]: string }

interface FormProps<T> {
  id: string
  className: string
  action: string
  method: string
  inputs: Array<InputProps>,
  submit: (req: FormRequestInput) => Promise<T>
  afterSubmit: (resp: T) => void
  onSubmitError?: () => void
}

export interface InputProps {
  displayName: string
  type: React.HTMLInputTypeAttribute
  name: string
  value: string
  setValue?: (v: string) => void
}


// Generic form template
//
// props
//  className - classname for main form element
//  action - url for this http request
//  method - http method to use in the request
//  inputs - input hooks (array)
//    displayName - text shown in label of input form
//    name - name of the input
//    type - html value of the input type
//    value - the actual value of the text in the input
//    onChange - function to execute on input change
//  afterSubmit - hook to call upon a successful request (optional)
export default function Form<T>(props: FormProps<T>) {
  const [status, setStatus] = useState(NOT_SUBMITTED);
  const [statusMessage, setStatusMessage] = useState("");

  let inputs = props.inputs.map((input, i) => {
    return (
      <div className={input.type === 'hidden' ? "form-group d-none" : "form-group"} key={props.id + "-" + i}>
        <label htmlFor="input">{input.displayName}</label>
        <input type={input.type}
               name={input.name}
               value={input.value}
               onChange={(e) => {
                 setStatus(NOT_SUBMITTED);
                 input.setValue?.(e.target.value);
               }}
        />
      </div>
    );
  });

  const serializeRequest = (): FormRequestInput => {
    let form: FormRequestInput = {};

    props.inputs.forEach((input) => {
      form[input.name] = input.value;
    });

    return form;
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const req = serializeRequest();

    try {
      const resp = await props.submit(req);
      setStatus(SUCCESS);
      await props.afterSubmit(resp);
    } catch (e) {
      setStatus(FAILURE);
      props.onSubmitError?.();
    }
  };

  return (
    <>
      <form method={props.method}
            action={props.action}
            onSubmit={handleSubmit}
            className={status === SUBMITTED ? 'submitted ' + props.className : props.className}>
        {inputs}
        <button type="submit">Submit</button>
      </form>
      {
        statusMessage.length > 0 ?
          <p>{statusMessage}</p> :
          <></>
      }
    </>
  );
}
