const LobbyCreate = (io, socket, users, rooms) => {
  // LOBBY - CREATE ROOM PART {FOR OWNER}
  socket.on("createRoom", (roomParam) => {
    // roomParam is  --->
    // {
    //   userID: string,
    //   ownerID: string,
    //   room: string,
    //   owner: string,
    //   side: string
    // }

    socket.join(roomParam.room);
    users[socket.id].nickname = roomParam.owner;
    users[socket.id].room.owner = true;
    users[socket.id].room.roomID = roomParam.room;
    users[socket.id].game.side = roomParam.side;

    if (
      roomParam.room === "__proto__" ||
      roomParam.room === "constructor" ||
      roomParam.room === "prototype"
    ) {
      return socket.emit("error", "Invalid room name");
    }

    rooms[roomParam.room] = roomParam;
    rooms[roomParam.room].serverOSave = users[socket.id];
    io.emit("newRoom", roomParam);
  });
};

module.exports = LobbyCreate;
