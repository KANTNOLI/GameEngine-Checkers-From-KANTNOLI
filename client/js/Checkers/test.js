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


      