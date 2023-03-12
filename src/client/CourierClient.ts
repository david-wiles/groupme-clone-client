import {
  AccountResponse,
  ClientMessage,
  ListMessageResponse,
  ListRoomResponse,
  Message,
  MessageResponse, RoomResponse,
  WhoAmIResponse
} from "./messages";
import {ClientError, InvalidArgumentError} from "./Errors";

export const doRequest = async (method: string, location: string, body?: string, token?: string): Promise<Response> => {
  let headers: {[k: string]: string} = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = "Bearer " + token
  }

  let opts: RequestInit = {
    method,
    headers: headers
  };

  if (body) {
    opts.body = body;
  }

  return await fetch(`${process.env.REACT_APP_API_DOMAIN}${location}`, opts);
}

class RestClient {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  protected async fetch(method: string, location: string, body?: string): Promise<Response> {
    return doRequest(method, location, body, this.token);
  }
}

class MessageRestClient extends RestClient {
  // Messages are mapped from roomId -> set of messages for the room
  private messages: Map<string, Map<string, MessageResponse>> = new Map<string, Map<string, MessageResponse>>();
  private mailboxes = new Map<string, (msg: MessageResponse) => void>();

  onMessage(roomId: string, handler: (msg: MessageResponse) => void) {
    if (roomId) {
      this.mailboxes.set(roomId, handler);
    }
  }

  triggerMessage(payload: MessageResponse) {
    const handler = this.mailboxes.get(payload.roomId);
    handler?.call(handler, payload);
  }

  async list(roomId: string, from: Date, to?: Date): Promise<Array<MessageResponse>> {
    if (roomId) {
      let toStmt = to ? `&to=${to.toISOString()}` : '';
      let resp = await this.fetch("GET", `/message?from=${from.toISOString()}&room=${roomId}${toStmt}`);

      if (!resp.ok) {
        console.error(resp);
        return [];
      }

      const body: ListMessageResponse = await resp.json();
      this.mergeMessages(body.messages);

      return Array.from(this.messages.get(roomId)?.values() || []).sort(this.sortMessages);
    }

    throw new InvalidArgumentError("invalid room id");
  }

  async send(req: { message: string, roomId: string }) {
    const resp = await this.fetch("POST", "/message", JSON.stringify(req))
    let body: MessageResponse = await resp.json()
    this.mergeMessages([body]);
    this.triggerMessage(body);
  }

  private mergeMessages(messages: Array<MessageResponse>) {
    messages.forEach((message) => {
      if (!this.messages.has(message.roomId)) {
        this.messages.set(message.roomId, new Map<string, MessageResponse>());
      }
      this.messages.get(message.roomId)?.set(message.id, message);
    })
  }

  private sortMessages(a: MessageResponse, b: MessageResponse): number {
    return a.timestamp > b.timestamp ? 1 : a.timestamp === b.timestamp ? 0 : -1;
  }
}

class RoomRestClient extends RestClient {
  // Rooms are mapped roomId -> room
  private rooms: Map<string, RoomResponse> = new Map<string, RoomResponse>();

  async list(): Promise<ListRoomResponse> {
    let resp = await this.fetch("GET", "/room");

    if (!resp.ok) {
      throw new ClientError(resp.status, await resp.json())
    }

    const body: ListRoomResponse = await resp.json();
    body.rooms.forEach((room) => this.rooms.set(room.id, room));
    return body;
  }

  async create(name: string): Promise<RoomResponse> {
    let resp = await this.fetch("POST", "/room", JSON.stringify({name}));

    if (!resp.ok) {
      throw new ClientError(resp.status, await resp.json());
    }

    let room: RoomResponse = await resp.json();
    this.rooms.set(room.id, room);
    return room;
  }

  async join(id: string): Promise<RoomResponse> {
    if (id) {
      let resp = await this.fetch("POST", `/room/${id}/join`);

      if (!resp.ok) {
        throw new ClientError(resp.status, await resp.json());
      }

      let room: RoomResponse = await resp.json();
      this.rooms.set(room.id, room);
      return room;
    }

    throw new InvalidArgumentError("invalid room id");
  }

  async get(id: string): Promise<RoomResponse> {
    if (id) {
      let cached = this.rooms.get(id);
      if (cached) {
        return cached;
      }

      let resp = await this.fetch("GET", `/room/${id}`);

      if (!resp.ok) {
        throw new ClientError(resp.status, await resp.json());
      }

      let room: RoomResponse = await resp.json();
      this.rooms.set(room.id, room);
      return room;
    }

    throw new InvalidArgumentError("invalid room id");
  }
}

class AccountRestClient extends RestClient {
  // Accounts are mapped accountId -> account
  private accounts: Map<string, AccountResponse> = new Map<string, AccountResponse>();

  async get(id: string): Promise<AccountResponse> {
    if (id) {
      let resp = await this.fetch("GET", `/account/${id}`);

      if (!resp.ok) {
        throw new Error(resp.statusText);
      }

      let account: AccountResponse = await resp.json();

      this.accounts.set(account.id, account);
      return account;
    }

    throw new InvalidArgumentError("invalid account id");
  }
}

class RegistrationRestClient extends RestClient {
  async handleRegister(message: WhoAmIResponse): Promise<string> {
    const webhook = message.webhook;

    // Register webhook
    const resp = await this.fetch("POST", "/client/register", JSON.stringify({clientUrl: webhook}));

    if (!resp.ok) {
      console.error(resp);
      throw Error(await resp.json())
    }

    return webhook;
  }
}

export default class CourierClient {
  // Global state of all messages
  messages: MessageRestClient;
  rooms: RoomRestClient;
  accounts: AccountRestClient;

  private registrationClient: RegistrationRestClient;

  private connection?: WebSocket;
  private webhook?: string;

  constructor(token: string) {
    // @ts-ignore
    this.connection = new WebSocket(process.env.REACT_APP_WS_DOMAIN);

    this.connection.addEventListener('open', () => {
      // Authenticate with JWT token
      this.connection?.send(token);
    });

    this.connection.addEventListener('message', async (event: MessageEvent) => {
      let message: Message = JSON.parse(event.data);
      if ("webhook" in message && message.webhook) {
        this.webhook = await this.registrationClient.handleRegister(message);
      } else if ("payload" in message) {
        await this.handleNotification(message)
      }
    });

    this.messages = new MessageRestClient(token);
    this.rooms = new RoomRestClient(token);
    this.accounts = new AccountRestClient(token);
    this.registrationClient = new RegistrationRestClient(token);
  }

  private handleNotification(message: ClientMessage) {
    const payload: MessageResponse = JSON.parse(this.decodeBytes(message.payload));

    this.messages.triggerMessage(payload);

    if (message.acknowledge) {
      this.connection?.send(JSON.stringify({cid: message.cid}));
    }
  }

  // TODO decode base64 to unicode
  private decodeBytes(content: string): string {
    return atob(content)
  }
}
