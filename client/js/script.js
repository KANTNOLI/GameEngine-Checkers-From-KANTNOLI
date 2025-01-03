import * as THREE from "three";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

import { DefaultViEnConfig } from "./Engine/VisualEngineConfigs/DefaultViEnConfig.js";
import { DefaultCameraSettings } from "./Engine/Cameras/DefaultCameraSettings.js";
import { CameraLimitSquare } from "./Engine/Cameras/CameraLimitSquare.js";
import { DefaultOrbitControll } from "./Engine/PlayerActions/DefaultOrbitControll.js";
import { ModelsLoader } from "./Engine/OtherScripts/ModelsLoader.js";
import { HemisphereLightCfg } from "./Engine/Lighting/HemisphereLightCfg.js";
import { SpotLightCfg } from "./Engine/Lighting/SpotLightCfg.js";
import { ShadowCfg } from "./Engine/Lighting/ShadowCfg.js";
import { PointLightCfg } from "./Engine/Lighting/PointLightCfg.js";
import { TrackingClickItem } from "./Engine/PlayerActions/TrackingClickItem.js";

import { LoadCheckers } from "./Checkers/LoadCheckers.js";
import { Render } from "./Checkers/main.js";
import { ClearRemoveCells } from "./Checkers/ClearRemoveCells.js";
import { LoadingProcess } from "./Engine/OtherScripts/LoadingProcess.js";

const LOCALSTORE_USER_ID = "OLD_USER_ID";
const LOCALSTORE_USER_ACTIVE_ID = "USER_ID";
const LOCALSTORE_SIDE_STEP = "SIDE_STEP";
const LOCALSTORE_SIDE = "SIDE";
const LOCALSTORE_ROOM_ID = "ROOM_ID";

localStorage.setItem(LOCALSTORE_SIDE_STEP, "white");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  localStorage.setItem(LOCALSTORE_USER_ACTIVE_ID, socket.id);
});

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

socket.on("gameStepServer", (step) => {
  if (step.autor != socket.id) {
    console.log(`противник `, step);
  } else {
    console.log(`я  `, step);
  }
});

socket.on("gameStepQueue", (side) => {
  localStorage.setItem(LOCALSTORE_SIDE_STEP, side);
  console.log(side);
});

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

let gameArea = await fetch("/api/board/default").then((res) => res.json());

const visualEngine = DefaultViEnConfig({
  antialias: true,
  precision: "mediump",
  powerPrfrnc: "default",
  depth: true,
  shadowOn: true,
  shadowMap: "normal",
});

const scene = new THREE.Scene();

HemisphereLightCfg(scene, {
  intensity: 0.01,
});
PointLightCfg(
  scene,
  {
    x: 2,
    y: 1.2,
    z: 1.7,
  },
  {
    color: 0xffffff,
    intensity: 0.1,
  }
);
const mainLight = SpotLightCfg(
  scene,
  { intensity: 3 },
  {
    x: 2,
    y: 1.2,
    z: 1.7,
  }
);
ShadowCfg(scene);

const camera = DefaultCameraSettings(
  { x: 1.25, y: 1.25, z: 0.12 },
  {
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.01,
    far: 100,
  }
);
const playerControlls = DefaultOrbitControll(visualEngine, camera);
LoadCheckers(scene, gameArea);

ModelsLoader(
  scene,
  "models/chessboard.glb",
  { x: 0.115, y: -0.11, z: 0.115 },
  { casting: true, receiving: true },
  { width: 1, height: 0.8, length: 1 },
  [camera, mainLight],
  playerControlls,
  null
);
ModelsLoader(
  scene,
  "models/table_lamp.glb",
  { x: 2, y: -0.2, z: 1.7 },
  { casting: true, receiving: true },
  { width: 0.08, height: 0.08, length: 0.08 },
  null,
  null,
  {
    x: 0,
    y: 140,
    z: 0,
  }
);
ModelsLoader(
  scene,
  "models/room.glb",
  { x: 0.5, y: -3.45, z: 0.2 },
  { casting: true, receiving: true },
  { width: 0.04, height: 0.04, length: 0.04 },
  null,
  null,
  null,
  1
);

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

const animate = (time) => {
  playerControlls.update();
  visualEngine.render(scene, camera);
  CameraLimitSquare(camera, 5);
};

visualEngine.setAnimationLoop(animate);
animate();
