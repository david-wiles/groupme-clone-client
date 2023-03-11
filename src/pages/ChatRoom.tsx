import React, {useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useClient} from "../hooks/useClient";
import ChatMessages from "../components/ChatMessages";
import Form, {FormRequestInput} from "../components/Form";
import BaseLayout from "./BaseLayout";

export default function ChatRoom() {
  const {courier} = useClient();
  const {id} = useParams();

  const [text, setText] = useState<string>("");

  const messagesEndRef: React.Ref<any> = useRef(null);

  const scrollToBottom = (opts?: ScrollIntoViewOptions) => messagesEndRef.current?.scrollIntoView(opts);

  const afterSubmit = async () => {
    setText("");
  };

  return (
    <BaseLayout>
      <div className={"Chat"}>
        <ChatMessages scrollToBottom={scrollToBottom}/>
        <div className={"text-container"}>
          <Form id={"message-input-" + id}
                className={"message-form"}
                action={"/message"}
                method={"POST"}
                inputs={[
                  {
                    displayName: "message",
                    name: "message",
                    type: "text",
                    value: text,
                    setValue: setText,
                  },
                  {
                    displayName: "roomId",
                    name: "roomId",
                    type: "hidden",
                    value: id || "",
                  }
                ]}
                submit={(form: FormRequestInput) => courier.messages.sendMessage({
                  message: form['message'],
                  roomId: form['roomId']
                })
                }
                afterSubmit={afterSubmit}/>
        </div>
        <div ref={messagesEndRef}></div>
      </div>
    </BaseLayout>

  )
}
