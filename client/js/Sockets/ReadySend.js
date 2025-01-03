import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const LOCALSTORE_USER_ID = "OLD_USER_ID";
const LOCALSTORE_USER_ACTIVE_ID = "USER_ID";
const LOCALSTORE_ROOM_ID = "ROOM_ID";

const socket = io("http://localhost:3000");

export const ReadySend = () => {
  socket.emit("gameReady", localStorage.getItem(LOCALSTORE_USER_ACTIVE_ID));
  socket.disconnect();
};
