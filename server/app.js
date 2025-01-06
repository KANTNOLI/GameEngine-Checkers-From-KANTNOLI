const express = require("express");
const path = require("path");
const fs = require("fs");

const cors = require("cors");

const LobbyCreate = require("./Sockets/LobbyCreate");
const LobbyJoin = require("./Sockets/LobbyJoin");
const Game = require("./Sockets/Game");

const io = require("socket.io")(null, {
  cors: {
    origin: "*",
  },
});

let online = 0;
let rooms = {};
let users = {};

const app = express();

// app

app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

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

  LobbyCreate(io, socket, users, rooms);
  LobbyJoin(io, socket, users, rooms);
  Game(io, socket, users, rooms);

  socket.on("disconnect", (_) => {
    online--;
    io.emit("online", online);

    delete users[socket.id];
    if (rooms.length && rooms[users[socket.id].room.roomID]) {
      delete rooms[users[socket.id].room.roomID];
    }
  });
});

// start

app.listen(1000, () => {
  console.log(`http://localhost:1000`);
  console.log(`http://localhost:1000/game`);
});

io.listen(3000, () => {
  console.log(`http://localhost:3000`);
});
