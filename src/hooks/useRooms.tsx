import {createContext, useContext, useState} from "react";
import {RoomResponse} from "../client/messages";

interface UseRooms {
  rooms: Array<RoomResponse>,
  addRoom: (room: RoomResponse) => void,
  setRooms: (rooms: Array<RoomResponse>) => void
}

const RoomContext = createContext<UseRooms>({
  rooms: [],
  addRoom(room: RoomResponse) {
  },
  setRooms(rooms: Array<RoomResponse>) {
  }
});

// @ts-ignore
export function RoomProvider({children}) {
  const [rooms, setRooms] = useState<Array<RoomResponse>>([]);

  return <RoomContext.Provider value={{
    rooms: rooms,
    addRoom: (room: RoomResponse) => setRooms((rooms) => rooms.concat([room])),
    setRooms: (rooms: Array<RoomResponse>) => setRooms(rooms)
  }}>{children}</RoomContext.Provider>;
}

export const useRooms = () => {
  return useContext(RoomContext);
};
