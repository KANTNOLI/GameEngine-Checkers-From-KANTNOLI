import * as THREE from "three";
import { io } from "https://cdn.socket.io/4.8.1/socket.io.esm.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { lightSetup } from "./Lighting/DefaultLightSetup.js";
import { boardSetup } from "./boardSetup.js";
import { defaultSetup } from "./defaultSetup.js";
import { motion } from "./motion.js";

const LOCALSTORE_ID = "ID";
const LOCALSTORE_ROOM_ID = "ROOM_ID";

const socket = io("http://localhost:3000");

console.log(localStorage.getItem(LOCALSTORE_ROOM_ID));

socket.on("test", (data) => {
  let text = document.createElement("p");
  text.innerText = data;

  document.querySelector("#chat").append(text);
  console.log(data);
});

// для удобства
const width = window.innerWidth;
const height = window.innerHeight;

let board = await fetch("/api/board/default").then((res) => res.json());
let removeVariate = [];

const loader = new GLTFLoader();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x303030);

const light = lightSetup(scene);

// настройка окна
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// дефолт рендеры по типу сцены, которые по сути пока динамично не изменяются и скорее всего не будут
const renderObj = defaultSetup(renderer, scene, board);
board = renderObj.board;
boardSetup(loader, scene, renderObj.camera, light, renderObj.controls);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("click", async (event) => {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, renderObj.camera);
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
  renderObj.controls.update();
  renderer.render(scene, renderObj.camera);
};

renderer.setAnimationLoop(animate);
animate();
