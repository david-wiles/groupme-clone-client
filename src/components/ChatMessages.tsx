import React, {useEffect, useState} from 'react';
import {ListMessageResponse, MessagePayload, MessageResponse} from "../client/messages";
import {useParams} from 'react-router-dom';
import {useClient} from "../hooks/useClient";
import {useAuth} from "../hooks/useAuth";
import {useSubsequentEffect} from "../hooks/useSubsequentEffect";

interface ChatMessagesProps {
  scrollToBottom: (opts?: ScrollIntoViewOptions) => void
}

export default function ChatMessages({scrollToBottom}: ChatMessagesProps) {
  const {courier} = useClient();
  const [messages, setMessages] = useState(new Array<MessageResponse>());
  const {auth} = useAuth();
  const {id} = useParams();

  const roomId = id || "";

  courier.onMessage(roomId, (msg: MessagePayload) => {
    setMessages((messages) => {
      return messages.concat([
        {
          userId: msg.userId,
          content: msg.content,
          timestamp: msg.timestamp
        }
      ]);
    });
    scrollToBottom({behavior: "smooth"});
  });

  useEffect(() => {
    courier.fetchRecentMessages(roomId).then((messages: Array<MessageResponse>) => {
      setMessages(messages.reverse());
    });
  }, [roomId]);

  useSubsequentEffect(() => scrollToBottom(), [messages.length]);

  return (
    <>
      {
        messages.map((message) => {
          const classes = message.userId === auth.id ? "outgoingMessage messageBubble" : "incomingMessage messageBubble";
          return (
            <p key={message.userId + message.timestamp} className={classes}>
              {message.content}
            </p>
          )
        })
      }
    </>
  );
}
