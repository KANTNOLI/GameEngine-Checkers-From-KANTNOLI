export const ClearRemoveCells = (scene, removeCells) => {
  if (removeCells) {
    removeCells.map((cell, id) => {
      scene.remove(cell);
    });
    removeCells.length = 0;
    // тут я заюзал так, тю.к это поддерживает все ссылки если = []
    // то элементы могут не удаляться должным образом
  }
};
