const LobbyJoin = (io, socket, users, rooms) => {
  // LOBBY - JOIN ROOM PART {FOR PLAYER}
  socket.on("joinRoom", (joinParam) => {
    socket.join(joinParam.roomID);

    users[socket.id].nickname = joinParam.nickname;
    users[socket.id].game.side = joinParam.side;
    users[socket.id].game.enemyID = joinParam.owner;
    users[socket.id].room.roomID = joinParam.roomID;
    users[socket.id].room.owner = false;

    rooms[joinParam.roomID].serverPSave = users[socket.id];
    rooms[joinParam.roomID].player = joinParam.nickname;
    users[joinParam.owner].game.enemyID = socket.id;
    rooms[joinParam.roomID].userID = socket.id;
    // создаем комнату, кидаем ид румы чтобы потом слинковать и отправляем на /game
    // console.log(users);

    io.to(joinParam.roomID).emit("gameStart", joinParam.roomID);
  });
};

module.exports = LobbyJoin;
