type Message = WhoAmIResponse | ClientMessage

interface WhoAmIResponse {
  webhook: string
}

interface ClientAck {
  cid: string
}

interface ClientMessage {
  payload: string
  cid: string
  acknowledge: boolean
}

export default class CourierClient {
  public domain: string = 'localhost';
  public mailbox: Array<string> = [];

  private readonly token: string;
  private connection?: WebSocket;
  private webhook?: string;

  constructor(token: string) {
    this.token = token;
    this.connection = new WebSocket('ws://' + this.domain + ":8080");

    this.connection.addEventListener('open', () => {
      // Authenticate
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

  sendMessage(msg: string, room: string) {

  }

  private async handleRegister(message: WhoAmIResponse) {
    this.webhook = message.webhook;

    // Register webhook
    const resp = await fetch(this.domain + ":9000/client/register", {
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
    // Add message to mailbox
    this.mailbox.push(message.payload);

    if (message.acknowledge) {
      // Send ClientAck
      const ack: ClientAck = {cid: message.cid};
      this.connection?.send(JSON.stringify(ack));
    }
  }
}
