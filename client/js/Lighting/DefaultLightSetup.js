import * as THREE from "three";

// low
// medium
// high
// ultra
// epic

const setQualityLight = (light, backLight, size) => {
  light.shadow.mapSize.width = size;
  light.shadow.mapSize.height = size;
  backLight.shadow.mapSize.width = size;
  backLight.shadow.mapSize.height = size;
};

export const defaultLightSetup = (
  scene,
  quality = "medium",
  lightPos = { x: -2.5, y: 5, z: -2.5 },
  lightIntnsty = { light: 0.6, backLight: 0.1 },
  opacity = 0.5
) => {
  // проверка на долбоеба
  if (
    !(scene instanceof THREE.Scene) ||
    !(typeof lightPos === "object") ||
    !(typeof lightIntnsty === "object") ||
    !(typeof quality === "string") ||
    !(typeof opacity === "number")
  ) {
    console.error(
      `DefaultLightSetup error: The transmitted ones are incorrect`
    );
    console.error(
      `DefaultLightSetup error: Received data except !scene! => ${JSON.stringify(
        lightPos
      )} - Is this an object?`
    );
    console.error(
      `DefaultLightSetup error: Received data except !scene! => ${JSON.stringify(
        lightIntnsty
      )} - Is this an object?`
    );
    console.error(
      `DefaultLightSetup error: Received data except !scene! => ${quality} - Is this an string?`
    );
    console.error(
      `DefaultLightSetup error: Received data except !scene! => ${opacity} - Is this an number?`
    );

    alert("Fatal error! Look client console");
    return -1;
  }

  //Настройка света
  const light = new THREE.DirectionalLight(0xffffff, lightIntnsty.light);
  light.position.set(lightPos.x, lightPos.y, lightPos.z);
  light.castShadow = true;

  //перебивка. фоновый, чтобы тени были не очень неграми, стоп чо
  const backLight = new THREE.DirectionalLight(
    0xffffff,
    lightIntnsty.backLight
  );
  backLight.position.set(-lightPos.x, lightPos.y, -lightPos.z); // если не пон почему тут -, то глек
  backLight.castShadow = true;

  // относительо графики делаем качество теней. По умолч medium, та даже если ошибка, пофиг
  switch (quality) {
    case "low":
      setQualityLight(light, backLight, 512);
      break;
    case "high":
      setQualityLight(light, backLight, 2048);
      break;
    case "ultra":
      setQualityLight(light, backLight, 4096);
      break;
    case "epic":
      setQualityLight(light, backLight, 8192);
      break;
    default: {
      setQualityLight(light, backLight, 1024);
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
  scene.add(backLight);
  scene.add(shadow);

  return {
    light,
    backLight,
  };
};
