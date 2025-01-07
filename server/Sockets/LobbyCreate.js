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

    users[socket.id].room = users[socket.id].room || Object.create(null);
    users[socket.id].game = users[socket.id].game || Object.create(null);

    users[socket.id].nickname = roomParam.owner;
    users[socket.id].room.owner = true;
    users[socket.id].room.roomID = roomParam.room;
    users[socket.id].game.side = roomParam.side;

    rooms[roomParam.room] = Object.assign(Object.create(null), roomParam);
    rooms[roomParam.room].serverOSave = Object.assign(
      Object.create(null),
      users[socket.id]
    );

    io.emit("newRoom", roomParam);
  });
};

module.exports = LobbyCreate;
