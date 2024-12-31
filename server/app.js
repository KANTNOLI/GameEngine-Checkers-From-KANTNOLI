const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const io = require("socket.io")(null, {
  cors: {
    origin: "*",
  },
});

let online = 0;
let rooms = {};
let users = {};

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

app.use((req, res, next) => {
  console.log(req.url);

  next();
});

app.get("/api/board/default", (_, res) => {
  res
    .status(200)
    .end(fs.readFileSync(path.join(__dirname, "gameBoard.json"), "utf-8"));
});

app.get("/game", (_, res) => {
  res
    .status(200)
    .end(fs.readFileSync(path.join(__dirname, "../client/game.html"), "utf-8"));
});

app.get("/api/game/rooms", (_, res) => {
  res.status(200).end(JSON.stringify(rooms), "utf-8");
});

app.get("/api/game/online", (_, res) => {
  res.status(200).end(JSON.stringify(online), "utf-8");
});

app.listen(1000, () => {
  console.log(`http://localhost:1000`);
  console.log(`http://localhost:1000/game`);
});

// sockets
io.on("connection", (socket) => {
  users[socket.id] = {
    nickname: "Anonymous", // get after start game
    game: {
      play: false, // status, play or not
      side: null, // side in game, black || white
      enemyID: null, // id enemy
    },
    room: {
      roomID: null,
      owner: false, // owner or no
    },
  };

  online++;
  io.emit("online", online);

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

    rooms[roomParam.room] = roomParam;
    // notification for render rooms
    io.emit("newRoom", roomParam);
  });

  // LOBBY - JOIN ROOM PART {FOR PLAYER}
  socket.on("joinRoom", (joinParam) => {
    socket.join(joinParam.roomID);

    users[socket.id].nickname = joinParam.nickname;
    users[socket.id].game.side = joinParam.side;
    users[socket.id].game.enemyID = joinParam.owner;
    users[socket.id].room.roomID = joinParam.roomID;
    users[socket.id].room.owner = false;

    users[joinParam.owner].game.enemyID = socket.id;
    rooms[joinParam.roomID].userID = socket.id;
    // создаем комнату, кидаем ид румы чтобы потом слинковать и отправляем на /game
    io.to(joinParam.roomID).emit("gameStart", joinParam.roomID);
  });

  socket.on("disconnect", (_) => {
    online--;
    io.emit("online", online);

    delete users[socket.id];
    if (rooms.length && rooms[users[socket.id].room.roomID]) {
      delete rooms[users[socket.id].room.roomID];
    }
  });
});

// я видел вариант с обьеденением под 1 порт, но так мне больше нравится
io.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
