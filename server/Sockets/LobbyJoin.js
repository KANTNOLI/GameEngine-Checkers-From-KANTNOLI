const LobbyJoin = (io, socket, users, rooms) => {
  // LOBBY - JOIN ROOM PART {FOR PLAYER}
  socket.on("joinRoom", (joinParam) => {
    socket.join(joinParam.roomID);

    users[socket.id] = users[socket.id] || Object.create(null);
    users[socket.id].room = users[socket.id].room || Object.create(null);
    users[socket.id].game = users[socket.id].game || Object.create(null);

    users[socket.id].nickname = joinParam.nickname;
    users[socket.id].game.side = joinParam.side;
    users[socket.id].game.enemyID = joinParam.owner;
    users[socket.id].room.roomID = joinParam.roomID;
    users[socket.id].room.owner = false;

    rooms[joinParam.roomID].serverPSave = Object.assign(Object.create(null), {
      nickname: users[socket.id].nickname,
      game: {
        play: users[socket.id].game.play || false,
        side: users[socket.id].game.side || null,
        enemyID: users[socket.id].game.enemyID || null,
      },
      room: {
        roomID: users[socket.id].room.roomID || null,
        owner: users[socket.id].room.owner || false,
      },
    });

    rooms[joinParam.roomID].player = joinParam.nickname;
    users[joinParam.owner].game.enemyID = socket.id;
    rooms[joinParam.roomID].userID = socket.id;

    io.to(joinParam.roomID).emit("gameStart", joinParam.roomID);
  });
};

module.exports = LobbyJoin;
