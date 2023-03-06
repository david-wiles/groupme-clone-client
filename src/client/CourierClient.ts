import {
  ClientAck,
  ClientMessage,
  ListMessageResponse,
  ListRoomResponse,
  Message,
  MessageResponse,
  WhoAmIResponse
} from "./messages";

export default class CourierClient {
  public mailboxes = new Map<string, (msg: MessageResponse) => void>();

  private readonly token: string;
  private connection?: WebSocket;
  private webhook?: string;

  // Global state of all messages
  private messages: Map<string, Array<MessageResponse>> = new Map<string, Array<MessageResponse>>();

  constructor(token: string) {
    this.token = token;
    // @ts-ignore
    this.connection = new WebSocket(process.env.REACT_APP_WS_DOMAIN);

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

  async fetch(method: string, location: string, body?: string): Promise<Response> {
    let opts: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.token
      }
    };

    if (body) {
      opts.body = body;
    }

    return await fetch(`${process.env.REACT_APP_API_DOMAIN}${location}`, opts);
  }

  onMessage(roomId: string, handler: (msg: MessageResponse) => void) {
    this.mailboxes.set(roomId, handler);
  }

  async fetchRecentMessages(roomId: string): Promise<Array<MessageResponse>> {
    if (this.messages.has(roomId)) {
      return this.messages.get(roomId) || [];
    }

    const from = new Date("2012-12-12");
    let resp = await this.fetch("GET", `/message?from=${from.toISOString()}&room=${roomId}`);

    if (!resp.ok) {
      console.error(resp);
      return [];
    }

    const body: ListMessageResponse = await resp.json();
    this.prependMessages(body.messages);
    return this.messages.get(body.messages[0]?.roomId) || [];
  }

  async fetchRooms(): Promise<ListRoomResponse> {
    let resp = await this.fetch("GET", "/room");

    if (!resp.ok) {
      console.error(resp);
      return {rooms: []};
    }

    return await resp.json();
  }

  triggerMessage(payload: MessageResponse) {
    const handler = this.mailboxes.get(payload.roomId);
    handler?.call(handler, payload);
    this.prependMessages([payload])
  }

  private async handleRegister(message: WhoAmIResponse) {
    this.webhook = message.webhook;

    // Register webhook
    const resp = await this.fetch("POST", "/client/register", JSON.stringify({clientUrl: this.webhook}));

    if (!resp.ok) {
      console.error(resp);
      this.connection?.close(1001);
    }
  }

  private handleNotification(message: ClientMessage) {
    const payload: MessageResponse = JSON.parse(this.decodeBytes(message.payload));

    this.triggerMessage(payload);

    if (message.acknowledge) {
      this.connection?.send(JSON.stringify({cid: message.cid}));
    }
  }

  // TODO decode base64 to unicode
  private decodeBytes(content: string): string {
    return atob(content)
  }

  private prependMessages(messages: Array<MessageResponse>) {
    messages.forEach((message) => {
      this.messages.set(messages[0].roomId, [message].concat(this.messages.get(message.roomId) || []));
    });
  }
}
