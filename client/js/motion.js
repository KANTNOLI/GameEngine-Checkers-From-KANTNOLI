import * as THREE from "three";

const oneCell = 0.235;
const VariatePos = [
  {
    x: 1,
    z: 1,
  },
  {
    x: -1,
    z: 1,
  },
  {
    x: 1,
    z: -1,
  },
  {
    x: -1,
    z: -1,
  },
];

export const motion = async (scene, obj, board, remove) => {
  console.log(obj);
  console.log(board);
  console.log(remove);
  

  // let result = stepVariations(obj, scene, board, remove);
  let result = { board: 0, remove: 0 };
  return { board: result.board, remove: result.remove };
};
