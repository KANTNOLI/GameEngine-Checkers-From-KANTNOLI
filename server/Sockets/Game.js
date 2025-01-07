const Game = (io, socket, users, rooms) => {
  socket.on("connectGames", (oldUserParam) => {
    // id: 'O4jZwsokJ5tJN6hSAAAF'
    // room: 'room name'

    if (oldUserParam.room === '__proto__' || oldUserParam.room === 'constructor' || oldUserParam.room === 'prototype') {
      return; // Reject dangerous keys
    }
    if (rooms[oldUserParam.room].ownerID === oldUserParam.id) {
      rooms[oldUserParam.room].ownerID = socket.id;
      users[socket.id] = rooms[oldUserParam.room].serverOSave;
    } else {
      rooms[oldUserParam.room].userID = socket.id;
      users[socket.id] = rooms[oldUserParam.room].serverPSave;
    }
    users[socket.id].game.play = true;
    socket.join(oldUserParam.room);

    io.to(oldUserParam.room).emit("gamePlayersSides", {
      ownerID: rooms[oldUserParam.room].ownerID,
      ownerSide: rooms[oldUserParam.room].side,
      playerID: rooms[oldUserParam.room].userID,
      playerSide: rooms[oldUserParam.room].side === "white" ? "black" : "white",
    });
  });

  socket.on("gameReady", () => {
    //H771SsdxAwhvMQkrAAAN
    users[socket.id].game.play = true;
  });

  socket.on("gameStep", (step) => {
    //   queueFlag - soon
    //   room: 'room name',
    //   autor: 'CAi-FmsKIg-MBzOCAAAP',
    //   step:
    //     type: 'kill',
    //     side: 'white',
    //     activePosition: { x: 4, z: 0 },
    //     positionKill: { x: 3, z: 1 },
    //     position: { x: 2, z: 2 },
    //     queen: false

    if (step.room === '__proto__' || step.room === 'constructor' || step.room === 'prototype') {
      return; // Reject dangerous keys
    }
    rooms[step.room].motion =
      rooms[step.room].motion === "white" ? "black" : "white";
    io.to(step.room).emit("gameStepQueue", rooms[step.room].motion);
    io.to(step.room).emit("gameStepServer", step);
  });
};

module.exports = Game;
