export type Message = WhoAmIResponse | ClientMessage

export interface WhoAmIResponse {
  webhook: string
}

export interface ClientAck {
  cid: string
}

export interface MessageRequest {
  message: string
  roomId: string
}

export interface ClientMessage {
  payload: string // payload may be encrypted, we will treat as a string
  cid: string
  acknowledge: boolean
}

export interface ListRoomResponse {
  rooms: Array<RoomResponse>
}

export interface RoomResponse {
  id: string
  name: string
  members: Array<string>
}

export interface ListMessageResponse {
  messages: Array<MessageResponse>
}

export interface MessageResponse {
  id: string
  roomId: string
  userId: string
  content: string
  timestamp: string
}

export interface AuthResponse {
  token: string
  id: string
}

export interface AccountResponse {
  id: string
  username: string
}