const LOCALSTORE_USER_ACTIVE_ID = "USER_ID";

export const ReadySend = (socket) => {
  socket.emit("gameReady", localStorage.getItem(LOCALSTORE_USER_ACTIVE_ID));
};
