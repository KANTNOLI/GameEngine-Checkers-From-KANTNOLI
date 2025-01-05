import * as THREE from "three";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

import { DefaultViEnConfig } from "./Engine/VisualEngineConfigs/DefaultViEnConfig.js";
import { DefaultCameraSettings } from "./Engine/Cameras/DefaultCameraSettings.js";
import { CameraLimitSquare } from "./Engine/Cameras/CameraLimitSquare.js";
import { DefaultOrbitControll } from "./Engine/PlayerActions/DefaultOrbitControll.js";
import { TrackingClickItem } from "./Engine/PlayerActions/TrackingClickItem.js";

import { LoadCheckers } from "./Checkers/LoadCheckers.js";
import { Render } from "./Checkers/main.js";
import { ClearRemoveCells } from "./Checkers/ClearRemoveCells.js";
import { CellStep } from "./Checkers/CellStep.js";
import { CellKill } from "./Checkers/CellKill.js";
import { ModelsFullRender } from "./ProjectBuilder/ModelsFullRender.js";

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
ModelsFullRender(scene, camera, LigthingFullRender(), playerControlls);

// загружаем шашки для игры
LoadCheckers(scene, gameArea);

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
      removeCells
    );
  } else {
    ClearRemoveCells(scene, removeCells);
  }
});

//////////////////////////////////////////////////////////////////////////////////////

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  localStorage.setItem(LOCALSTORE_USER_ACTIVE_ID, socket.id);
});

//Получаем активную нащусторону для дальнейшей игры
socket.on("gamePlayersSides", (sides) => {
  if (sides.ownerID === socket.id) {
    localStorage.setItem(LOCALSTORE_SIDE, sides.ownerSide);
    console.log(`owner `, socket.id);
  } else {
    localStorage.setItem(LOCALSTORE_SIDE, sides.playerSide);
    console.log(`player `, socket.id);
  }

  console.log(sides);
});

// Получаем ход противника
socket.on("gameStepServer", (step) => {
  if (step.autor != socket.id) {
    if (step.step.type === "other") {
      console.log("step");

      CellStep(scene, gameArea, step.step.activePosition, step.step);
    } else {
      CellKill(
        scene,
        gameArea,
        step.step.activePosition,
        step.step,
        removeCells,
        true
      );
    }
    console.log("end");

    console.log(gameArea);
  } else {
    console.log(`я `);
  }
});

socket.on("gameStepQueue", (side) => {
  localStorage.setItem(LOCALSTORE_SIDE_STEP, side);
  console.log(side);
});

// Отправляем данные для линковки с прошлыми данными
socket.emit("connectGames", {
  id: localStorage.getItem(LOCALSTORE_USER_ID),
  room: localStorage.getItem(LOCALSTORE_ROOM_ID),
});

// socket.on("connectGames", (data) => {
//   let text = document.createElement("p");
//   text.innerText = data;

//   document.querySelector("#chat").append(text);
//   console.log(data);
// });

//////////////////////////////////////////////////////////////////////////////////////////////

const animate = (time) => {
  playerControlls.update();
  visualEngine.render(scene, camera);
  CameraLimitSquare(camera, 5);
};

visualEngine.setAnimationLoop(animate);
animate();
