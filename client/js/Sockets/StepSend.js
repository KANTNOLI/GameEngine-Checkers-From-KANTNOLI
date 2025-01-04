import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const LOCALSTORE_USER_ID = "OLD_USER_ID";
const LOCALSTORE_USER_ACTIVE_ID = "USER_ID";
const LOCALSTORE_SIDE_STEP = "SIDE_STEP";
const LOCALSTORE_SIDE = "SIDE";
const LOCALSTORE_ROOM_ID = "ROOM_ID";

const socket = io("http://localhost:3000");

export const StepSend = (sendSteps) => {
  console.log(`111111`, 111111);
  socket.emit("gameStep", {
    room: localStorage.getItem(LOCALSTORE_ROOM_ID),
    autor: localStorage.getItem(LOCALSTORE_USER_ACTIVE_ID),
    step: sendSteps,
  });

  //socket.disconnect();
};
