import {
  ClientAck,
  ClientMessage,
  ListMessageResponse,
  ListRoomResponse,
  Message,
  MessagePayload, MessageResponse,
  WhoAmIResponse
} from "./messages";

export default class CourierClient {
  public domain: string = 'localhost';
  public mailboxes = new Map<string, (msg: MessagePayload) => void>();

  private readonly token: string;
  private connection?: WebSocket;
  private webhook?: string;

  // Global state of all messages
  private messages: Map<string, Array<MessageResponse>> = new Map<string, Array<MessageResponse>>();

  constructor(token: string) {
    this.token = token;
    this.connection = new WebSocket('ws://' + this.domain + ":8080");

    this.connection.addEventListener('open', () => {
      // Authenticate with JWT token
      this.connection?.send(token);
    });

    this.connection.addEventListener('message', async (event: MessageEvent) => {
      let message: Message = JSON.parse(event.data);
      if ("webhook" in message && message.webhook) {
        await this.handleRegister(message);
      } else if ("payload" in message) {
        await this.handleNotification(message)
      }
    });
  }

  onMessage(roomId: string, handler: (msg: MessagePayload) => void) {
    this.mailboxes.set(roomId, handler);
  }

  async fetchRecentMessages(roomId: string): Promise<Array<MessageResponse>> {
    if (this.messages.has(roomId)) {
      return this.messages.get(roomId) || [];
    }

    const from = new Date("2012-12-12");
    let resp = await fetch(`http://${this.domain}:9000/message?from=${from.toISOString()}&room=${roomId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.token
      }
    });

    if (!resp.ok) {
      console.error(resp);
      return [];
    }

    const body: ListMessageResponse = await resp.json();

    return this.prependMessages(roomId, body.messages);
  }

  async fetchRooms(): Promise<ListRoomResponse> {
    let resp = await fetch("http://" + this.domain + ":9000/room", {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.token
      }
    });

    if (!resp.ok) {
      console.error(resp);
      return {
        rooms: []
      };
    }

    return await resp.json();
  }

  triggerMessage(payload: MessagePayload) {
    const handler = this.mailboxes.get(payload.roomId);
    handler?.call(handler, payload);
  }

  private async handleRegister(message: WhoAmIResponse) {
    this.webhook = message.webhook;

    // Register webhook
    const resp = await fetch("http://" + this.domain + ":9000/client/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.token
      },
      body: JSON.stringify({
        clientUrl: this.webhook
      })
    });

    if (!resp.ok) {
      console.error(resp);
      this.connection?.close(1001);
    }
  }

  private handleNotification(message: ClientMessage) {
    const payload: MessagePayload = JSON.parse(this.decodeBytes(message.payload));

    this.triggerMessage(payload);

    const currentMessages = this.prependMessages(payload.roomId, [{
      userId: payload.userId,
      timestamp: payload.timestamp,
      content: payload.content
    }])

    if (message.acknowledge) {
      // Send ClientAck
      const ack: ClientAck = {cid: message.cid};
      this.connection?.send(JSON.stringify(ack));
    }
  }

  // TODO decode base64 to unicode
  private decodeBytes(content: string): string {
    return atob(content)
  }

  private prependMessages(roomId: string, messages: Array<MessageResponse>): Array<MessageResponse> {
    const currentMessages = messages.concat(this.messages.get(roomId) || []);
    this.messages.set(roomId, currentMessages);
    return currentMessages;
  }
}
