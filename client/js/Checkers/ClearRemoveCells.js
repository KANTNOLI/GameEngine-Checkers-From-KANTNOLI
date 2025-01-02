export const ClearRemoveCells = (scene, removeCells, clearType = null) => {
  // clearType (OnlyStep \ Null)
  if (removeCells) {
    removeCells.map((cell, id) => {
      if (clearType && cell.type === "killer") {
        scene.remove(cell.select);
      } else {
        scene.remove(cell.select);
      }
    });
    removeCells.length = 0;
  }
};
