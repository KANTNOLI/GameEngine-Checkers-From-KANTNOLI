import { HemisphereLightCfg } from "../Engine/Lighting/HemisphereLightCfg.js";
import { PointLightCfg } from "../Engine/Lighting/PointLightCfg.js";
import { ShadowCfg } from "../Engine/Lighting/ShadowCfg.js";
import { SpotLightCfg } from "../Engine/Lighting/SpotLightCfg.js";

export const LigthingFullRender = (scene) => {
  ShadowCfg(scene);

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

  return mainLight;
};
