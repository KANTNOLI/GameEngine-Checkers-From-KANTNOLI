import * as THREE from "three";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";

import { DefaultViEnConfig } from "./Engine/VisualEngineConfigs/DefaultViEnConfig.js";
import { DefaultLightSetup } from "./Engine/Lighting/DefaultLightSetup.js";
import { DefaultCameraSettings } from "./Engine/Cameras/DefaultCameraSettings.js";
import { DefaultOrbitControll } from "./Engine/PlayerActions/DefaultOrbitControll.js";
import { LoadCheckers } from "./Engine/OtherScripts/loadCheckers.js";

import { boardSetup } from "./boardSetup.js";
import { motion } from "./motion.js";

// const LOCALSTORE_ID = "ID";
// const LOCALSTORE_ROOM_ID = "ROOM_ID";

const socket = io("http://localhost:3000");

// console.log(localStorage.getItem(LOCALSTORE_ROOM_ID));

// socket.on("test", (data) => {
//   let text = document.createElement("p");
//   text.innerText = data;

//   document.querySelector("#chat").append(text);
//   console.log(data);
// });

let gameArea = await fetch("/api/board/default").then((res) => res.json());
let removeVariate = [];

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x303030);

const visualEngine = DefaultViEnConfig();
const lighting = DefaultLightSetup(scene, "epic");
const camera = DefaultCameraSettings();
const playerControlls = DefaultOrbitControll(visualEngine, camera);
console.log(gameArea);
LoadCheckers(scene, gameArea); // передаем копию массива, по сути присваивать глупо?
console.log(gameArea);


boardSetup(scene, camera, lighting, playerControlls);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", async (event) => {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);
  const selectedObject = intersects[0].object;

  //console.log(selectedObject);
  if (selectedObject.userData.position && !selectedObject.userData.board) {
    let result = await motion(scene, selectedObject, gameArea, removeVariate);
    // board = result.board;
    //  removeVariate = result.remove;
  }

  /// console.log(board);
});

const animate = (time) => {
  playerControlls.update();
  visualEngine.render(scene, camera);
};

visualEngine.setAnimationLoop(animate);
animate();
