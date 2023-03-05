import React, {useEffect, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useClient} from "../hooks/useClient";
import ChatMessages from "../components/ChatMessages";
import Form from "../components/Form";
import {MessagePayload} from "../client/messages";
import {useAuth} from "../hooks/useAuth";

export default function ChatRoom() {
  const {courier} = useClient();
  const {auth} = useAuth();
  const {id} = useParams();

  const [text, setText] = useState<string>("");

  const messagesEndRef: React.Ref<any> = useRef(null);

  const scrollToBottom = (opts?: ScrollIntoViewOptions) => messagesEndRef.current?.scrollIntoView(opts);

  const handleResponse = async (resp: Response) => {
    if (resp.status < 300) {
      let body: MessagePayload = await resp.json()
      courier.triggerMessage(body);
      setText("");
    }
  };

  return (
    <div className={"Chat"}>
      <ChatMessages scrollToBottom={scrollToBottom}/>
      <div className={"text-container"}>
        <Form id={"message-input-" + id}
              className={"message-form"}
              action={"http://localhost:9000/message"}
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
              authToken={auth.token}
              afterSubmit={handleResponse}/>
      </div>
      <div ref={messagesEndRef}></div>
    </div>
  )
}
