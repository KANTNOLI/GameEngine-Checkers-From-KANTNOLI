import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

const LOCALSTORE_USER_ID = "OLD_USER_ID"
const LOCALSTORE_ROOM_ID = "ROOM_ID"

const socket = io("http://localhost:3000");

let rooms = await fetch("/api/game/rooms").then((res) => res.json());
const online = await fetch("/api/game/online").then((res) => res.json());

// ставим значение онлайна по умолчанию 
document.querySelector(".online").innerText = `Online: ${online}`;
 
// при выборе игры
socket.on("gameStart", (roomID) => {
  // save id user and room
  localStorage.setItem(LOCALSTORE_USER_ID, socket.id)
  localStorage.setItem(LOCALSTORE_ROOM_ID, roomID)
  window.location = `/game`
});

// получаем онлайн int
socket.on("online", (online) => {
  document.querySelector(".online").innerText = `Online: ${online}`;
});

// чекаем создание новых номнат и делаем перерендер типо крутые 
socket.on("newRoom", (room) => {
  let div = document.createElement("div");
  div.classList.add("searchGame");
  div.setAttribute("roomID", room.room);
  div.setAttribute("owner", room.ownerID);
  div.setAttribute("side", room.side);
  div.innerText = `${room.room} (${room.owner}) - ${room.side}`;

  div.addEventListener("click", (e) => {
    const login = document.querySelector("#login");

    if (login.value.length >= 3) {
      localStorage.setItem(LOCALSTORE_USER_ID, socket.id)
      socket.emit("joinRoom", {
        roomID: e.target.getAttribute("roomID"),
        owner: e.target.getAttribute("owner"),
        nickname: login.value,
        side: e.target.getAttribute("side") === "white" ? "black" : "white",
      });
    } else {
      setTimeout(() => {
        login.classList.remove("warn");
      }, 2000);
      login.classList.add("warn");
    }
  });

  rooms[room.room] = room;
  nav.append(div);
});

//render rooms
const nav = document.querySelector("nav");

for (const roomID in rooms) {
  let div = document.createElement("div");
  div.classList.add("searchGame");
  div.setAttribute("roomID", rooms[roomID].room);
  div.setAttribute("owner", rooms[roomID].ownerID);
  div.setAttribute("side", rooms[roomID].side);
  div.innerText = `${rooms[roomID].room} (${rooms[roomID].owner}) - ${rooms[roomID].side}`;

  div.addEventListener("click", (e) => {
    const login = document.querySelector("#login");

    if (login.value.length >= 3) {
      localStorage.setItem(LOCALSTORE_USER_ID, socket.id)

      socket.emit("joinRoom", {
        roomID: e.target.getAttribute("roomID"),
        owner: e.target.getAttribute("owner"),
        nickname: login.value,
        side: e.target.getAttribute("side") === "white" ? "black" : "white",
      });
    } else {
      setTimeout(() => {
        login.classList.remove("warn");
      }, 2000);
      login.classList.add("warn");
    }
  });

  nav.append(div);
}

// filter
document.querySelector("#search").addEventListener("input", (e) => {
  let games = document.querySelectorAll(".searchGame");

  for (let i = 0; i < games.length; i++) {
    if (
      games[i].textContent.toLowerCase().includes(e.target.value.toLowerCase())
    ) {
      games[i].classList.remove("none");
    } else {
      games[i].classList.add("none");
    }
  }
});

// create room
document.querySelector("button").addEventListener("click", async () => {
  const side = document.querySelector('input[name="side"]:checked');
  const room = document.querySelector("#roomName");
  const nick = document.querySelector("#nickname");

  document.querySelector("#createROOM").innerText = `room: ${room.value}`
  document.querySelector("#createNAME").innerText = `await (${nick.value})`

  // проверка и создание
  if (
    side &&
    room.value.length >= 3 &&
    nick.value.length >= 3
  ) {

    // отправка команаты на сервер и игрокам
    let tempRoom = {
      userID: null,
      ownerID: socket.id,
      room: room.value,
      owner: nick.value,
      serverOSave: null,
      player: null,
      serverPSave: null,
      side: 
        side.value != "random"
          ? side.value
          : Math.floor(Math.random() * 2)
            ? "black"
            : "white",
    };

    document.querySelector("#SectChooseGame").classList.add("none");
    document.querySelector("#SectCreateRoom").classList.add("none");
    document.querySelector("#loading").classList.remove("none");

    socket.emit("createRoom", tempRoom);
    rooms[room.value] = tempRoom;
  } else {
    // варним инпуты если траблы. таумаут раньше т.к. так хочу и красивее
    setTimeout(() => {
      room.classList.remove("warn");
      nick.classList.remove("warn");
    }, 2000);
    room.classList.add("warn");
    nick.classList.add("warn");
  }
});
