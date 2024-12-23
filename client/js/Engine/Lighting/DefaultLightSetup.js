import * as THREE from "three";

// low
// medium
// high
// ultra
// epic

const outputError = (error) => {
  console.error(error);
  alert("Fatal error! Look client console");
  return -1;
};

const setQualityLight = (light, size) => {
  light.shadow.mapSize.width = size;
  light.shadow.mapSize.height = size;
};

export const DefaultLightSetup = (
  scene,
  quality = "medium",
  lightPos = { x: -2.5, y: 5, z: -2.5 },
  lightIntnsty = 0.6,
  opacity = 0.5,
  bias = -0.0000038
) => {
  if (!(scene instanceof THREE.Scene)) {
    return outputError(
      `DefaultLightSetup error: The transmitted ones are incorrect`
    );
  } else if (!(typeof lightPos === "object")) {
    return outputError(
      `DefaultLightSetup error: Received data except !scene! => ${JSON.stringify(
        lightPos
      )} - Is this an object?`
    );
  } else if (!(typeof lightIntnsty === "number")) {
    return outputError()`DefaultLightSetup error: Received data except !scene! => ${JSON.stringify(
      lightIntnsty
    )} - Is this an object?`;
  } else if (!(typeof quality === "string")) {
    return outputError(
      `DefaultLightSetup error: Received data except !scene! => ${quality} - Is this an string?`
    );
  } else if (!(typeof opacity === "number")) {
    return outputError(
      `DefaultLightSetup error: Received data except !scene! => ${opacity} - Is this an number?`
    );
  }

  //Настройка света
  const light = new THREE.DirectionalLight(0xffffff, lightIntnsty);
  light.position.set(lightPos.x, lightPos.y, lightPos.z);
  light.shadow.bias = bias;
  light.castShadow = true;

  // относительо графики делаем качество теней. По умолч medium, та даже если ошибка, пофиг
  switch (quality) {
    case "low":
      setQualityLight(light, 512);
      break;
    case "high":
      setQualityLight(light, 2048);
      break;
    case "ultra":
      setQualityLight(light, 4096);
      break;
    case "epic":
      setQualityLight(light, 8192);
      break;
    default: {
      setQualityLight(light, 1024);
    }
  }

  //Настройка тени
  const shadowGeometry = new THREE.PlaneGeometry(10, 10); // По сути тень это типо пласт
  const shadowMaterial = new THREE.ShadowMaterial({ opacity: opacity }); // Интенс тени
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial); //Линкуем
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.2;

  //Добавляем
  scene.add(light);
  scene.add(shadow);

  return light;
};
