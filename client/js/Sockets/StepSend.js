const LOCALSTORE_USER_ID = "OLD_USER_ID";
const LOCALSTORE_USER_ACTIVE_ID = "USER_ID";
const LOCALSTORE_SIDE_STEP = "SIDE_STEP";
const LOCALSTORE_SIDE = "SIDE";
const LOCALSTORE_ROOM_ID = "ROOM_ID";

export const StepSend = (sendSteps, socket) => {
  socket.emit("gameStep", {
    room: localStorage.getItem(LOCALSTORE_ROOM_ID),
    autor: localStorage.getItem(LOCALSTORE_USER_ACTIVE_ID),
    step: sendSteps,
  });

  //socket.disconnect();
};
