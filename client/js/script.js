import * as THREE from "three";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

import { DefaultViEnConfig } from "./Engine/VisualEngineConfigs/DefaultViEnConfig.js";
import { DefaultCameraSettings } from "./Engine/Cameras/DefaultCameraSettings.js";
import { CameraLimitSquare } from "./Engine/Cameras/CameraLimitSquare.js";
import { DefaultOrbitControll } from "./Engine/PlayerActions/DefaultOrbitControll.js";
import { ModelsLoader } from "./Engine/OtherScripts/ModelsLoader.js";
import { DefaultLightSetup } from "./Engine/Lighting/DefaultLightSetup.js";
import { TrackingClickItem } from "./Engine/PlayerActions/TrackingClickItem.js";

import { LoadCheckers } from "./Engine/OtherScripts/loadCheckers.js";

import { motion } from "./motion.js";

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

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x303030);

const visualEngine = DefaultViEnConfig({
  antialias: true,
  precision: "mediump",
  powerPrfrnc: "default",
  depth: true,
  shadowOn: true,
  shadowMap: "normal",
});
const lighting = DefaultLightSetup(
  scene,
  "epic",
  { x: 0.5, y: 1, z: 0.5 },
  0.5,
  0.5,
  -0.000004
);
const BackLighting = DefaultLightSetup(
  scene,
  "epic",
  { x: -0.5, y: 1, z: -0.5 },
  0.1,
  0.5,
  -0.000004
);

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
  [lighting, BackLighting, camera],
  playerControlls
);
// room
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
  CameraLimitSquare(camera, {
    height: 6,
    length: 6.3,
  });
};

visualEngine.setAnimationLoop(animate);
animate();
