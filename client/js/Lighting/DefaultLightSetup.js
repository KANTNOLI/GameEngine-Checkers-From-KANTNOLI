import * as THREE from "three";

export const DefaultLightSetup = (
  scene,
  lightPos = { x: -2.5, y: 5, z: -2.5 },
  quality = "high"
) => {
  // проверка на долбоеба
  if (
    !(scene instanceof THREE.Scene) ||
    !(typeof lightPos === "object") ||
    !(typeof quality === "string")
  ) {
    console.error(`DefaultLightSetup error: The transmitted ones are incorrect`);
    console.error(
      `DefaultLightSetup error: Received data except scene => ${JSON.stringify(
        lightPos
      )} - Is this an object?`
    );
    console.error(
      `DefaultLightSetup error: Received data except scene => ${quality} - Is this an string?`
    );
  }

  //Настройка света
  const light = new THREE.DirectionalLight(0xffffff, 0.6);
  light.position.set(lightPos.x, lightPos.y, lightPos.z);
  light.castShadow = true;
  light.shadow.mapSize.width = 4084;
  light.shadow.mapSize.height = 4084;

  //перебивка. фоновый, чтобы тени были не очень неграми, стоп чо
  const backLight = new THREE.DirectionalLight(0xffffff, 0.1);
  backLight.position.set(-lightPos.x, lightPos.y, -lightPos.z); // если не пон почему тут -, то глек
  backLight.castShadow = true;
  backLight.shadow.mapSize.width = 4084;
  backLight.shadow.mapSize.height = 4084;

  //Настройка тени
  const shadowGeometry = new THREE.PlaneGeometry(10, 10); // По сути тень это типо пласт
  const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Интенс тени
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial); //Линкуем
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -0.2;

  //Добавляем
  scene.add(light);
  scene.add(backLight);
  scene.add(shadow);

  return light;
};
