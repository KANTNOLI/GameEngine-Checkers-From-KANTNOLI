import * as THREE from "three";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

import { DefaultCameraSettings } from "./Engine/Cameras/DefaultCameraSettings.js";
import { DefaultOrbitControll } from "./Engine/PlayerActions/DefaultOrbitControll.js";
import { DefaultViEnConfig } from "./Engine/VisualEngineConfigs/DefaultViEnConfig.js";
import { CameraLimitSquare } from "./Engine/Cameras/CameraLimitSquare.js";
import { TrackingClickItem } from "./Engine/PlayerActions/TrackingClickItem.js";

import { LigthingFullRender } from "./ProjectBuilder/LigthingFullRender.js";
import { ModelsFullRender } from "./ProjectBuilder/ModelsFullRender.js";

import { ClearRemoveCells } from "./Checkers/ClearRemoveCells.js";
import { LoadCheckers } from "./Checkers/LoadCheckers.js";
import { CellStep } from "./Checkers/CellStep.js";
import { CellKill } from "./Checkers/CellKill.js";
import { Render } from "./Checkers/main.js";

import { GettingData } from "./Sockets/GettingData.js";

// получаем массив для игры, карту игры [{{},{},{}, ...}, ...]
let gameArea = await fetch("/api/board/default").then((res) => res.json());

// удобнее хранить по строчке в ключе
const LOCALSTORE_USER_ID = "OLD_USER_ID";
const LOCALSTORE_USER_ACTIVE_ID = "USER_ID";
const LOCALSTORE_SIDE_STEP = "SIDE_STEP";
const LOCALSTORE_SIDE = "SIDE";
const LOCALSTORE_ROOM_ID = "ROOM_ID";

// по умолчанию первый ход за белыми
localStorage.setItem(LOCALSTORE_SIDE_STEP, "white");

// дефолтные переменные для рендера сцены и картинки + камера с ее управлением
const visualEngine = DefaultViEnConfig();
const scene = new THREE.Scene();
const camera = DefaultCameraSettings({ x: 1.25, y: 1.25, z: 0.12 });
const playerControlls = DefaultOrbitControll(visualEngine, camera);

// делаем полный рендер моделек
ModelsFullRender(scene, camera, LigthingFullRender(scene), playerControlls);

// загружаем шашки для игры
LoadCheckers(scene, gameArea);

// создаем подключение т.к. после этой строки онно
const socket = io("http://localhost:3000");

let removeCells = [];
window.addEventListener("click", async (event) => {
  if (
    TrackingClickItem(scene, camera, event).object.metaData &&
    (TrackingClickItem(scene, camera, event).object.metaData.object.type ===
      "checkerPiece" ||
      TrackingClickItem(scene, camera, event).object.metaData.object.side ===
        "other")
  ) {
    Render(
      scene,
      gameArea,
      TrackingClickItem(scene, camera, event).object,
      removeCells,
      socket
    );
  } else {
    ClearRemoveCells(scene, removeCells);
  }
});

const animate = (time) => {
  playerControlls.update();
  visualEngine.render(scene, camera);
  CameraLimitSquare(camera, 5);
};

visualEngine.setAnimationLoop(animate);
animate();

// SOCKETS
// SOCKETS
// SOCKETS

socket.on("connect", () => {
  localStorage.setItem(LOCALSTORE_USER_ACTIVE_ID, socket.id);
});

GettingData(scene, gameArea, socket, removeCells);

// Отправляем данные для линковки с прошлыми данными
socket.emit("connectGames", {
  id: localStorage.getItem(LOCALSTORE_USER_ID),
  room: localStorage.getItem(LOCALSTORE_ROOM_ID),
});
