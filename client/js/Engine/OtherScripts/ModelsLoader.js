import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// scene, camera, lighting, controls

export const ModelsLoader = (
    scene,
    path = "models/error.glb",
    position = { x: 0, y: 0, z: 0 },
    shadow = { casting: true, receiving: false },
    scale = { width: 1, height: 1, length: 1 },
    looksAt = null,
    controll = null,
) => {
    const modelsLoader = new GLTFLoader();

    //"models/chessboard.glb",
    modelsLoader.load(path, (model) => {
        //x: 0.115, y: -0.0777, z: 0.115
        model.scene.position.x = position.x;
        model.scene.position.y = position.y;
        model.scene.position.z = position.z;

        //width: 1, height: 0.5, length: 
        model.scene.scale.set(scale.width, scale.height, scale.length);

        if (typeof shadow === "object") {
            model.scene.traverse((node) => {
                if (node.isMesh) {
                    node.castShadow = shadow.casting  // отбрасывание тени = casting shadow
                    node.receiveShadow = shadow.receiving; // получение тени = receiving shadow
                }
            });
        }

        // если мы получили массив элементов рендера, которые должны смотреть на модель, то парсим
        if (Array.isArray(looksAt)) {
            looksAt.map((object, id) => {
                console.log(object);
                object.isObject3D ? object.lookAt(model.scene.position) : console.error(`ModelsLoader error: element = ${id} id, is not object!`);
            })
        }

        // если мы получаем контроллер, то делаем таргет на данную модельку
        typeof controll === "object" ? controll.target.copy(model.scene.position) : console.error(`ModelsLoader error: controller is not object!`);

        scene.add(model.scene);
    });


    return modelsLoader;
}

