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

    users[socket.id] = users[socket.id] || Object.create(null);
    users[socket.id].room = users[socket.id].room || Object.create(null);
    users[socket.id].game = users[socket.id].game || Object.create(null);

    users[socket.id].nickname = roomParam.owner;
    users[socket.id].room.owner = true;
    users[socket.id].room.roomID = roomParam.room;
    users[socket.id].game.side = roomParam.side;

    if (roomParam.room === '__proto__' || roomParam.room === 'constructor' || roomParam.room === 'prototype') {
      return socket.emit('error', 'Invalid room name');
    }
    rooms[roomParam.room] = Object.assign(Object.create(null), roomParam);

    rooms[roomParam.room].serverOSave = Object.assign(Object.create(null), {
      nickname: users[socket.id].nickname,
      game: {
        play: users[socket.id].game.play || false,
        side: users[socket.id].game.side || null,
        enemyID: users[socket.id].game.enemyID || null
      },
      room: {
        roomID: users[socket.id].room.roomID || null,
        owner: users[socket.id].room.owner || false
      }
    });

    io.emit("newRoom", roomParam);
  });
};

module.exports = LobbyCreate;
