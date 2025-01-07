import { CellKill } from "../Checkers/CellKill.js";
import { CellStep } from "../Checkers/CellStep.js";

const LOCALSTORE_USER_ID = "OLD_USER_ID";
const LOCALSTORE_USER_ACTIVE_ID = "USER_ID";

const LOCALSTORE_SIDE_STEP = "SIDE_STEP";
const LOCALSTORE_SIDE = "SIDE";
const LOCALSTORE_ROOM_ID = "ROOM_ID";

const LOCALSTORE_COUNT_W = "COUNT_W";
const LOCALSTORE_COUNT_B = "COUNT_B";

export const GettingData = (scene, gameArea, socket, removeCells) => {
  // При подключении к сервер и загрузки самой игры
  // Мы отправляем новый ид для линковки старой информации
  // с новым ИД
  // и получаем нашу сторону
  socket.on("gamePlayersSides", (sides) => {
    if (sides.ownerID === socket.id) {
      localStorage.setItem(LOCALSTORE_SIDE, sides.ownerSide);
    } else {
      localStorage.setItem(LOCALSTORE_SIDE, sides.playerSide);
    }
  });

  // Если противник закончил ходить, делаем его ход
  socket.on("gameStepServer", (step) => {
    if (step.autor != socket.id) {
      if (step.step.type === "other") {
        CellStep(scene, gameArea, step.step.activePosition, step.step);
      } else {
        step.step.side === "white"
          ? localStorage.setItem(
              LOCALSTORE_COUNT_B,
              +localStorage.getItem(LOCALSTORE_COUNT_B) - 1
            )
          : localStorage.setItem(
              LOCALSTORE_COUNT_W,
              +localStorage.getItem(LOCALSTORE_COUNT_W) - 1
            );

        CellKill(
          scene,
          gameArea,
          step.step.activePosition,
          step.step,
          removeCells,
          true,
          socket
        );
      }
    }
  });

  // Получаем если очередь поменялась
  socket.on("gameStepQueue", (side) => {
    localStorage.setItem(LOCALSTORE_SIDE_STEP, side);
  });
};
