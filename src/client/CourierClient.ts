import {
  AccountResponse,
  ClientAck,
  ClientMessage,
  ListMessageResponse,
  ListRoomResponse,
  Message, MessageRequest,
  MessageResponse, RoomResponse,
  WhoAmIResponse
} from "./messages";
import {useRooms} from "../hooks/useRooms";

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
  private messages: Map<string, Set<MessageResponse>> = new Map<string, Set<MessageResponse>>();
  private mailboxes = new Map<string, (msg: MessageResponse) => void>();

  onMessage(roomId: string, handler: (msg: MessageResponse) => void) {
    this.mailboxes.set(roomId, handler);
  }

  triggerMessage(payload: MessageResponse) {
    const handler = this.mailboxes.get(payload.roomId);
    handler?.call(handler, payload);
  }

  async fetchRecent(roomId: string): Promise<Array<MessageResponse>> {
    const from = new Date("2012-12-12");
    let resp = await this.fetch("GET", `/message?from=${from.toISOString()}&room=${roomId}`);

    if (!resp.ok) {
      console.error(resp);
      return [];
    }

    const body: ListMessageResponse = await resp.json();
    this.mergeMessages(body.messages);

    return Array.from(this.messages.get(roomId) || []);
  }

  async sendMessage(req: { message: string, roomId: string }) {
    const resp = await this.fetch("GET", "/message", JSON.stringify(req))
    let body: MessageResponse = await resp.json()
    this.mergeMessages([body]);
    // courier.triggerMessage(body);
  }

  mergeMessages(messages: Array<MessageResponse>) {
    messages.forEach((message) => {
      if (!this.messages.has(message.roomId)) {
        this.messages.set(message.roomId, new Set<MessageResponse>())
      }

      this.messages.get(message.roomId)?.add(message);
    })
  }
}

class RoomRestClient extends RestClient {
  // Rooms are mapped roomId -> room
  private rooms: Map<string, RoomResponse> = new Map<string, RoomResponse>();

  async list(): Promise<ListRoomResponse> {
    let resp = await this.fetch("GET", "/room");

    if (!resp.ok) {
      console.error(resp);
      return {rooms: []};
    }

    const body: ListRoomResponse = await resp.json();
    body.rooms.forEach((room) => this.rooms.set(room.id, room));
    return body;
  }

  async create(name: string): Promise<RoomResponse> {
    let resp = await this.fetch("POST", "/room", JSON.stringify({name}));

    if (!resp.ok) {
      console.error(resp);
    }

    let room: RoomResponse = await resp.json();

    this.rooms.set(room.id, room);
    return room;
  }

  async join(id: string): Promise<RoomResponse> {
    let resp = await this.fetch("POST", `/room/${id}/join`);

    if (!resp.ok) {
      throw new Error(resp.statusText);
    }

    let room: RoomResponse = await resp.json();

    this.rooms.set(room.id, room);
    return room;
  }

  listCached(): Array<RoomResponse> {
    return Array.from(this.rooms.values());
  }
}

class AccountRestClient extends RestClient {
  // Accounts are mapped accountId -> account
  private accounts: Map<string, AccountResponse> = new Map<string, AccountResponse>();
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
