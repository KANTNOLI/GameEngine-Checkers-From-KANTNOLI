import * as THREE from "three";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

import { DefaultViEnConfig } from "./VisualEngineConfigs/DefaultViEnConfig.js";
import { DefaultLightSetup } from "./Lighting/DefaultLightSetup.js";
import { DefaultCameraSettings } from "./Cameras/DefaultCameraSettings.js";
import { DefaultOrbitControll } from "./PlayerActions/DefaultOrbitControll.js";

import { boardSetup } from "./boardSetup.js";
import { defaultSetup } from "./defaultSetup.js";
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

// для удобства
const width = window.innerWidth;
const height = window.innerHeight;

let board = await fetch("/api/board/default").then((res) => res.json());
let removeVariate = [];

const modelsLoader = new GLTFLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x303030);

// настройка окна

const visualEngine = DefaultViEnConfig();
const lighting = DefaultLightSetup(scene, "epic");
const camera = DefaultCameraSettings();
const playerControlls = DefaultOrbitControll(visualEngine, camera);

// дефолт рендеры по типу сцены, которые по сути пока динамично не изменяются и скорее всего не будут
const renderObj = defaultSetup(visualEngine, scene, camera, board);
board = renderObj.board;
boardSetup(modelsLoader, scene, camera, lighting, playerControlls);

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
    let result = await motion(scene, selectedObject, board, removeVariate);
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
