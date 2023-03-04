import React, {useContext, useEffect, useRef, useState} from 'react';
import "./Chat.scss"
import {GlobalContext} from "../App";
import {MessagePayload, MessageResponse} from "../CourierClient";

interface ChatProps {
  roomId: string
  isHidden: boolean
}

export default function ChatRoom(props: ChatProps) {

  const {courierClient, selfId} = useContext(GlobalContext);

  const [messages, setMessages] = useState(new Array<MessageResponse>());

  const messagesEndRef: React.Ref<any> = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({behavior: "smooth"});

  courierClient?.onMessage(props.roomId, (msg: MessagePayload) => {
    setMessages((messages) => {
      messages.push({
        userId: msg.userId,
        content: msg.content,
        timestamp: msg.content
      })
      return messages;
    })
  });

  useEffect(() => {
    // Request last few messages, scroll to bottom
    courierClient?.fetchRecentMessages(props.roomId)
      .then((response) => setMessages(response.messages));

    messagesEndRef.current?.scrollIntoView()
  }, [courierClient, props.isHidden, props.roomId]);

  return (
    <div className={props.isHidden ? "Chat" : "Chat"}>
      {
        messages.map((message) => {
          const classes = message.userId === selfId ? "outgoingMessage messageBubble" : "incomingMessage messageBubble";
          return (
            <p key={message.userId + message.timestamp} className={classes}>
              [{message.timestamp}] {message.content} {message.userId}
            </p>
          )
        })
      }
      <div ref={messagesEndRef}></div>
    </div>
  );
}
