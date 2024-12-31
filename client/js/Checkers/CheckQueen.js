export const CheckQueen = (position, side, queen) => {
  if (
    (side === "black" && position.z === 7) ||
    (side === "white" && position.z === 0) || queen
  ) {
    return true;
  }

  return false;
};
