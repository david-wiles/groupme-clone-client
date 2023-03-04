type Message = WhoAmIResponse | ClientMessage

interface WhoAmIResponse {
  webhook: string
}

interface ClientAck {
  cid: string
}

interface ClientMessage {
  payload: string // payload may be encrypted, we will treat as a string
  cid: string
  acknowledge: boolean
}

export interface MessagePayload {
  roomId: string
  userId: string
  timestamp: string
  content: string
}

interface ListRoomResponse {
  rooms: Array<RoomResponse>
}

export interface RoomResponse {
  id: string
  name: string
  members: Array<string>
}

interface ListMessageResponse {
  messages: Array<MessageResponse>
}

export interface MessageResponse {
  userId: string
  content: string
  timestamp: string
}

export default class CourierClient {
  public domain: string = 'localhost';
  public mailboxes = new Map<string, (msg: MessagePayload) => void>();

  private readonly token: string;
  private connection?: WebSocket;
  private webhook?: string;

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

  sendMessage(msg: string, room: string) {

  }

  async fetchRecentMessages(roomId: string): Promise<ListMessageResponse> {
    const from = new Date("2012-12-12");
    let resp = await fetch(`http://${this.domain}:9000/message?from=${from.toISOString()}&room=${roomId}`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.token
      }
    });

    if (!resp.ok) {
      console.error(resp);
      return {
        messages: []
      };
    }

    return await resp.json();
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
    const payload: MessagePayload = JSON.parse(message.payload);

    const handler = this.mailboxes.get(payload.roomId);
    handler?.call(handler, payload);

    if (message.acknowledge) {
      // Send ClientAck
      const ack: ClientAck = {cid: message.cid};
      this.connection?.send(JSON.stringify(ack));
    }
  }
}
