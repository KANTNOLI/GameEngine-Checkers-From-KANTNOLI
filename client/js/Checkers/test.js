if (
    gameArea[nextStepZ + move.z] &&
    gameArea[nextStepZ + move.z][nextStepX + move.x] &&
    gameArea[nextStepZ][nextStepX].object.type === "checkerPiece" &&
    gameArea[nextStepZ][nextStepX].object.side != object.side &&
    gameArea[nextStepZ + move.z][nextStepX + move.x].object.type === null
  ) {

    if (object.queen) {
      renderStepsQueen(
        scene,
        gameArea,
        original,
        move,
        nextStepZ,
        nextStepX,
        removeCells,
        killLine
      );
    } else {
      MakeSelect(
        scene,
        gameArea,
        removeCells,
        original,
        nextStepX + move.x,
        nextStepZ + move.z,
        "other",
        "killer"
      ).metaData.object.kill = gameArea[nextStepZ][nextStepX];
    }
}


if (object.queen) {
    renderStepsQueen(
      scene,
      gameArea,
      original,
      move,
      nextStepZ,
      nextStepX,
      removeCells
    );
  }

  // while (true) {
  //   console.log("active !");
    if (
      killerFlag.type != "far" &&
      gameArea[nextStepZ] &&
      gameArea[nextStepZ][nextStepX] &&
      gameArea[nextStepZ][nextStepX].object.type === null &&
      (object.side === move.side || object.queen)
    ) {
      let counter = 1;
      console.log("active !", counter);
      // если можем ходить
      MakeSelect(
        scene,
        gameArea,
        removeCells,
        original,
        nextStepX,
        nextStepZ,
        "other",
        "other"
      );




































      let counter = 1;
  while (true) {
    killLine = killLine
      ? killLine
      : {
          original: original,
          z: nextStepZ,
          x: nextStepX,
        };

    if (
      gameArea[nextStepZ + move.z * counter] &&
      gameArea[nextStepZ + move.z * counter][nextStepX + move.x * counter] &&
      gameArea[nextStepZ + move.z][nextStepX + move.x].object.type === null
    ) {
      try {
        MakeSelect(
          scene,
          gameArea,
          removeCells,
          killLine.original || original,
          nextStepX + move.x * counter,
          nextStepZ + move.z * counter,
          "other",
          "killer"
        ).metaData.object.kill = gameArea[killLine.z][killLine.x];
      } catch (error) {
        break;
      }

      counter++;
      console.log(killLine);
    } else {
      console.log(1);
      break;
    }
  }