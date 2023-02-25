import React, {useEffect, useRef} from 'react';
import "./Chat.scss"
import CourierClient from "../CourierClient";

interface ChatProps {
  room: string
  client?: CourierClient
  isSidebarOpen: boolean
}

export default function Chat(props: ChatProps) {

  const messagesEndRef: React.Ref<any> = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    // Request last few messages, scroll to bottom
    messagesEndRef.current?.scrollIntoView()
  });

  return (
    <div className={props.isSidebarOpen ? "Chat hidden" : "Chat"}>
      <p className={"incomingMessage messageBubble"}>
        This is some kind of chat message. Let's make it very long so that we can see what it looks like with lots of
        text. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull boy. All work and no
        play makes Jack a dull boy. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull
        boy. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull boy.
      </p>
      <p className={"incomingMessage messageBubble"}>
        This is a short message.
      </p>
      <p className={"incomingMessage messageBubble"}>
        This is some kind of chat message. Let's make it very long so that we can see what it looks like with lots of
        text. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull boy. All work and no
        play makes Jack a dull boy. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull
        boy. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull boy.
      </p>
      <div className="clear"></div>
      <p className={"outgoingMessage messageBubble"}>
        This is some kind of chat message. Let's make it very long so that we can see what it looks like with lots of
        text. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull boy. All work and no
        play makes Jack a dull boy. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull
        boy. All work and no play makes Jack a dull boy. All work and no play makes Jack a dull boy.
      </p>
      <div ref={messagesEndRef}></div>
    </div>
  );
}
