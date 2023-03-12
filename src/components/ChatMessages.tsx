import React, {useEffect, useState} from 'react';
import {AccountResponse, MessageResponse, RoomResponse} from "../client/messages";
import {useClient} from "../hooks/useClient";
import {useAuth} from "../hooks/useAuth";
import {useSubsequentEffect} from "../hooks/useSubsequentEffect";

interface ChatMessagesProps {
  scrollToBottom: (opts?: ScrollIntoViewOptions) => void
  room: RoomResponse
}

export default function ChatMessages({scrollToBottom, room}: ChatMessagesProps) {
  const {courier} = useClient();
  const {auth} = useAuth();

  const [messages, setMessages] = useState(new Array<MessageResponse>());
  const [members, setMembers] = useState(new Map<string, AccountResponse>());

  courier.messages.onMessage(room.id, (msg: MessageResponse) => {
    setMessages((messages) => messages.concat(msg));
    scrollToBottom({behavior: "smooth"});
  });

  useEffect(() => {
    const from = new Date();
    from.setDate(from.getDate() - 10);

    courier.messages.list(room.id, from)
      .then((messages: Array<MessageResponse>) => setMessages(messages));

    room.members.forEach((id) => {
      courier.accounts.get(id).then((account) => setMembers(new Map(members.set(account.id, account))));
    });
  }, [room.id]);

  useSubsequentEffect(() => scrollToBottom(), [messages.length]);

  return (
    <>
      {
        messages.map((message) => {
          return (
            <div className={"messageBubble"} key={message.id}>
              {
                message.userId === auth.id ?
                  <p className={"outgoingMessage"}>
                    {message.content}
                  </p>
                  :
                  <>
                    <small>{members.get(message.userId)?.username}</small>
                    <p className={"incomingMessage"}>
                      {message.content}
                    </p>
                  </>
              }
            </div>
          );
        })
      }
    </>
  );
}
