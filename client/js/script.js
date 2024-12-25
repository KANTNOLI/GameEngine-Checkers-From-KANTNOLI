import * as THREE from "three";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

import { DefaultViEnConfig } from "./Engine/VisualEngineConfigs/DefaultViEnConfig.js";
import { DefaultCameraSettings } from "./Engine/Cameras/DefaultCameraSettings.js";
import { CameraLimitSquare } from "./Engine/Cameras/CameraLimitSquare.js";
import { DefaultOrbitControll } from "./Engine/PlayerActions/DefaultOrbitControll.js";
import { ModelsLoader } from "./Engine/OtherScripts/ModelsLoader.js";
import { HemisphereLightCfg } from "./Engine/Lighting/HemisphereLightCfg.js";
import { DirectionalLightCfg } from "./Engine/Lighting/DirectionalLightCfg.js";
import { TrackingClickItem } from "./Engine/PlayerActions/TrackingClickItem.js";

import { LoadCheckers } from "./Engine/OtherScripts/loadCheckers.js";

import { motion } from "./motion.js";
import { ShadowCfg } from "./Engine/Lighting/ShadowCfg.js";
import { SpotLightCfg } from "./Engine/Lighting/SpotLightCfg.js";

// const LOCALSTORE_ID = "ID";
// const LOCALSTORE_ROOM_ID = "ROOM_ID";

const socket = io("http://localhost:3000");

// console.log(localStorage.getItem(LOCALSTORE_ROOM_ID));   7/3

// socket.on("test", (data) => {
//   let text = document.createElement("p");
//   text.innerText = data;

//   document.querySelector("#chat").append(text);
//   console.log(data);
// });

let gameArea = await fetch("/api/board/default").then((res) => res.json());
//let removeVariate = [];

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
const mainLight = SpotLightCfg(
  scene,
  { intensity: 3 },
  {
    x: 2,
    y: 1.2,
    z: 1.6,
  }
);

// const hepler = new THREE.SpotLightHelper(mainLight);
// scene.add(hepler);

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
LoadCheckers(scene, gameArea); // передаем копию массива, по сути присваивать глупо?

//board
ModelsLoader(
  scene,
  "models/chessboard.glb",
  { x: 0.115, y: -0.11, z: 0.115 },
  { casting: true, receiving: true },
  { width: 1, height: 0.8, length: 1 },
  [camera, mainLight],
  playerControlls
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

// room
ModelsLoader(
  scene,
  "models/room.glb",
  { x: 0.5, y: -3.45, z: 0.2 },
  { casting: true, receiving: true },
  { width: 0.04, height: 0.04, length: 0.04 }
);

ModelsLoader(
  scene,
  "models/room.glb",
  { x: 0.5, y: -3.45, z: 0.2 },
  { casting: true, receiving: true },
  { width: 0.04, height: 0.04, length: 0.04 }
);

window.addEventListener("click", async (event) => {
  console.log(TrackingClickItem(scene, camera, event));
});

const animate = (time) => {
  playerControlls.update();
  visualEngine.render(scene, camera);
  CameraLimitSquare(camera, 5);
};

visualEngine.setAnimationLoop(animate);
animate();
