
const removeVariateCell = (remove, scene, board) => {
  // с помощью массива проходим по доске и удаляем визуальо возможные ходы и вписываем пустые ячейки
  remove.map((select, id) => {
    board[select.arrayPosition.z][select.arrayPosition.x] = {
      position: {
        x: select.arrayPosition.x,
        z: select.arrayPosition.z,
      },
      object: "none",
    };
    scene.remove(select.render);
  });

  return board;
};

const setStep = (obj, scene, board, remove) => {
  const oneCell = 0.235;
  const removePos = remove[0].render.userData.pastPosition;
  // создаем обьект - фишку, для хода
  const cylinder = new THREE.Mesh(
    board[removePos.z][removePos.x].render.geometry,
    board[removePos.z][removePos.x].render.material
  );

  cylinder.position.x = oneCell * (obj.userData.position.x - 3);
  cylinder.position.z = oneCell * (obj.userData.position.z - 3);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.userData.object =
    board[removePos.z][removePos.x].render.userData.object;
  cylinder.userData.position = {
    x: obj.userData.position.x,
    z: obj.userData.position.z,
  };

  //удаляем по массиву возможность сделать
  board = removeVariateCell(remove, scene, board);

  // добавляем нашу фишку в доску
  board[obj.userData.position.z][obj.userData.position.x] = {
    object: board[removePos.z][removePos.x].object,
    position: { x: obj.userData.position.x, z: obj.userData.position.z },
    render: cylinder,
  };

  // удаляем визуальную фишку, прошлую, которой ходим
  scene.remove(board[removePos.z][removePos.x].render);
  // удаляем с доски фишку. тут из массива, там визуально
  board[removePos.z][removePos.x] = {
    position: {
      x: removePos.x,
      z: removePos.z,
    },
    object: "none",
  };

  // пока тупорно, просто говорим что все ок
  remove = [];
  // добавляем нашу фишку, делаем ход
  scene.add(cylinder);

  // возвращаем новую информацию
  return { board, remove };
};

const killCell = (obj, scene, board, remove, x, z) => {
  const objPos = obj.userData.position;

  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
  const texture = new THREE.MeshBasicMaterial({
    color: 0xf08080,
    transparent: true,
    opacity: 0.5,
  });

  if (
    board[objPos.z + z * 2] &&
    board[objPos.z + z * 2][objPos.x + x * 2] &&
    board[objPos.z + z * 2][objPos.x + x * 2].object == "none"
  ) {
    const motionMash = new THREE.Mesh(geometry, texture);
    motionMash.position.set(
      obj.position.x + oneCell * x * 2,
      0,
      obj.position.z + oneCell * z * 2
    );
    motionMash.userData.position = {
      x: objPos.x + x * 2,
      z: objPos.z + z * 2,
    };
    motionMash.userData.move = {
      x: x,
      z: z,
    };
    motionMash.userData.pastPosition = {
      x: objPos.x,
      z: objPos.z,
    };
    motionMash.userData.object = "kill";
    motionMash.userData.pastObject = board[objPos.z][objPos.x].object;
    motionMash.userData.material = board[objPos.z][objPos.x].render.material;

    board[objPos.z + z * 2][objPos.x + x * 2] = {
      position: {
        x: objPos.x + x * 2,
        z: objPos.z + z * 2,
      },
      object: "kill",
      render: motionMash,
    };

    remove.push({
      arrayPosition: {
        x: objPos.x + x * 2,
        z: objPos.z + z * 2,
      },
      render: board[objPos.z + z * 2][objPos.x + x * 2].render,
    });

    scene.add(motionMash);
  }

  return {
    board,
    remove,
  };
};

const abilityStep = (obj, scene, board, remove, i, object) => {
  const objPos = obj.userData.position;

  // заготовка, пока только зелень
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
  const texture = new THREE.MeshBasicMaterial({
    color: 0x90ee90,
    transparent: true,
    opacity: 0.5,
  });

  // создаем заготовку зеленную, визуал куда можно сделать ход
  const motionMash = new THREE.Mesh(geometry, texture);
  motionMash.userData.object = object;

  // рендер если в ячейке нету ничего, можно сделать ход + направление движения относительно цвета
  if (
    ((board[objPos.z][objPos.x].object == "white" && VariatePos[i].z == -1) ||
      (board[objPos.z][objPos.x].object == "black" && VariatePos[i].z == 1)) &&
    board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x].object ==
      "none"
  ) {
    // ставим на доску возможный ход
    motionMash.position.set(
      obj.position.x + oneCell * VariatePos[i].x,
      0,
      obj.position.z + oneCell * VariatePos[i].z
    );

    board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x] = {
      position: {
        x: objPos.x + VariatePos[i].x,
        z: objPos.z + VariatePos[i].z,
      },
      object: object,

      render: motionMash,
    };

    // записываем данные для удобства
    motionMash.userData.position = {
      x: objPos.x + VariatePos[i].x,
      z: objPos.z + VariatePos[i].z,
    };
    motionMash.userData.pastPosition = {
      x: objPos.x,
      z: objPos.z,
    };

    //пушим то что нужно будет удалить при ходе
    remove.push({
      arrayPosition: {
        x: objPos.x + VariatePos[i].x,
        z: objPos.z + VariatePos[i].z,
      },
      render: motionMash,
    });

    scene.add(motionMash);
  } else if (
    board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x].object !=
      "none" &&
    board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x].object !=
      board[objPos.z][objPos.x].object
  ) {
    let result = killCell(
      obj,
      scene,
      board,
      remove,
      VariatePos[i].x,
      VariatePos[i].z
    );

    board = result.board;
    remove = result.remove;
  }

  return {
    board,
    remove,
  };
};

const stepVariations = (obj, scene, board, remove) => {
  // x - is left     x + is rigth
  // z - is top     z + is bottom

  // если мы смотрели вариации какой то фишки, убираем старые визуалы и делаем новые
  if (
    remove[0] &&
    remove[0].render.userData.pastPosition != obj.userData.position &&
    obj.userData.object != "select" &&
    obj.userData.object != "kill"
  ) {
    removeVariateCell(remove, scene, board);
    remove = [];
  }

  //делаем анализ ходов, пока что так, этот код будет изменен (4 хода)
  for (let i = 0; i < VariatePos.length; i++) {
    const objPos = obj.userData.position;

    // если мы не выходим за поля, продолжаем рендер
    if (
      board[objPos.z + VariatePos[i].z] &&
      board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x] &&
      board[objPos.z][objPos.x].object != "select" &&
      board[objPos.z][objPos.x].object != "kill"
    ) {
      let result = abilityStep(obj, scene, board, remove, i, "select");
      board = result.board;
      remove = result.remove;
    } else if (board[objPos.z][objPos.x].object == "select") {
      // если выбрали куда ходить, делаем ход и убираем вариации
      let result = setStep(obj, scene, board, remove);
      board = result.board;
      remove = result.remove;
      break;
    } else if (board[objPos.z][objPos.x].object == "kill") {
      console.log("kill");
      const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
      const pastObj = board[objPos.z][objPos.x].render.userData.pastPosition;

      const cylinder = new THREE.Mesh(cylinderGeometry, obj.userData.material);
      cylinder.castShadow = true;
      cylinder.receiveShadow = true;
      cylinder.position.x = oneCell * (obj.userData.position.x - 3);
      cylinder.position.z = oneCell * (obj.userData.position.z - 3);
      cylinder.userData.object = obj.userData.pastObject;
      cylinder.userData.position = { x: objPos.x, z: objPos.z };

      scene.remove(board[pastObj.z][pastObj.x].render);
      scene.remove(board[objPos.z][objPos.x].render);
      scene.remove(
        board[objPos.z - obj.userData.move.z][objPos.x - obj.userData.move.x]
          .render
      );

      removeVariateCell(remove, scene, board);

      board[pastObj.z][pastObj.x] = {
        position: {
          x: pastObj.x,
          z: pastObj.z,
        },
        object: "none",
      };

      board[objPos.z - obj.userData.move.z][objPos.x - obj.userData.move.x] = {
        position: {
          x: objPos.x - obj.userData.move.x,
          z: objPos.z - obj.userData.move.z,
        },
        object: "none",
      };

      board[objPos.z][objPos.x] = {
        position: {
          x: objPos.x,
          z: objPos.z,
        },
        object: obj.userData.pastObject,
        render: cylinder,
      };

      remove = [];
      scene.add(cylinder);
      break;
    }
  }
  return { board, remove };
};

const removeVariateCell = (remove, scene, board) => {
  // с помощью массива проходим по доске и удаляем визуальо возможные ходы и вписываем пустые ячейки
  remove.map((select, id) => {
    board[select.arrayPosition.z][select.arrayPosition.x] = {
      position: {
        x: select.arrayPosition.x,
        z: select.arrayPosition.z,
      },
      object: "none",
    };
    scene.remove(select.render);
  });

  return board;
};

const setStep = (obj, scene, board, remove) => {
  const oneCell = 0.235;
  const removePos = remove[0].render.userData.pastPosition;
  // создаем обьект - фишку, для хода
  const cylinder = new THREE.Mesh(
    board[removePos.z][removePos.x].render.geometry,
    board[removePos.z][removePos.x].render.material
  );

  cylinder.position.x = oneCell * (obj.userData.position.x - 3);
  cylinder.position.z = oneCell * (obj.userData.position.z - 3);
  cylinder.castShadow = true;
  cylinder.receiveShadow = true;
  cylinder.userData.object =
    board[removePos.z][removePos.x].render.userData.object;
  cylinder.userData.position = {
    x: obj.userData.position.x,
    z: obj.userData.position.z,
  };

  //удаляем по массиву возможность сделать
  board = removeVariateCell(remove, scene, board);

  // добавляем нашу фишку в доску
  board[obj.userData.position.z][obj.userData.position.x] = {
    object: board[removePos.z][removePos.x].object,
    position: { x: obj.userData.position.x, z: obj.userData.position.z },
    render: cylinder,
  };

  // удаляем визуальную фишку, прошлую, которой ходим
  scene.remove(board[removePos.z][removePos.x].render);
  // удаляем с доски фишку. тут из массива, там визуально
  board[removePos.z][removePos.x] = {
    position: {
      x: removePos.x,
      z: removePos.z,
    },
    object: "none",
  };

  // пока тупорно, просто говорим что все ок
  remove = [];
  // добавляем нашу фишку, делаем ход
  scene.add(cylinder);

  // возвращаем новую информацию
  return { board, remove };
};

const killCell = (obj, scene, board, remove, x, z) => {
  const objPos = obj.userData.position;

  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
  const texture = new THREE.MeshBasicMaterial({
    color: 0xf08080,
    transparent: true,
    opacity: 0.5,
  });

  if (
    board[objPos.z + z * 2] &&
    board[objPos.z + z * 2][objPos.x + x * 2] &&
    board[objPos.z + z * 2][objPos.x + x * 2].object == "none"
  ) {
    const motionMash = new THREE.Mesh(geometry, texture);
    motionMash.position.set(
      obj.position.x + oneCell * x * 2,
      0,
      obj.position.z + oneCell * z * 2
    );
    motionMash.userData.position = {
      x: objPos.x + x * 2,
      z: objPos.z + z * 2,
    };
    motionMash.userData.move = {
      x: x,
      z: z,
    };
    motionMash.userData.pastPosition = {
      x: objPos.x,
      z: objPos.z,
    };
    motionMash.userData.object = "kill";
    motionMash.userData.pastObject = board[objPos.z][objPos.x].object;
    motionMash.userData.material = board[objPos.z][objPos.x].render.material;

    board[objPos.z + z * 2][objPos.x + x * 2] = {
      position: {
        x: objPos.x + x * 2,
        z: objPos.z + z * 2,
      },
      object: "kill",
      render: motionMash,
    };

    remove.push({
      arrayPosition: {
        x: objPos.x + x * 2,
        z: objPos.z + z * 2,
      },
      render: board[objPos.z + z * 2][objPos.x + x * 2].render,
    });

    scene.add(motionMash);
  }

  return {
    board,
    remove,
  };
};

const abilityStep = (obj, scene, board, remove, i, object) => {
  const objPos = obj.userData.position;

  // заготовка, пока только зелень
  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
  const texture = new THREE.MeshBasicMaterial({
    color: 0x90ee90,
    transparent: true,
    opacity: 0.5,
  });

  // создаем заготовку зеленную, визуал куда можно сделать ход
  const motionMash = new THREE.Mesh(geometry, texture);
  motionMash.userData.object = object;

  // рендер если в ячейке нету ничего, можно сделать ход + направление движения относительно цвета
  if (
    ((board[objPos.z][objPos.x].object == "white" && VariatePos[i].z == -1) ||
      (board[objPos.z][objPos.x].object == "black" && VariatePos[i].z == 1)) &&
    board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x].object ==
      "none"
  ) {
    // ставим на доску возможный ход
    motionMash.position.set(
      obj.position.x + oneCell * VariatePos[i].x,
      0,
      obj.position.z + oneCell * VariatePos[i].z
    );

    board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x] = {
      position: {
        x: objPos.x + VariatePos[i].x,
        z: objPos.z + VariatePos[i].z,
      },
      object: object,

      render: motionMash,
    };

    // записываем данные для удобства
    motionMash.userData.position = {
      x: objPos.x + VariatePos[i].x,
      z: objPos.z + VariatePos[i].z,
    };
    motionMash.userData.pastPosition = {
      x: objPos.x,
      z: objPos.z,
    };

    //пушим то что нужно будет удалить при ходе
    remove.push({
      arrayPosition: {
        x: objPos.x + VariatePos[i].x,
        z: objPos.z + VariatePos[i].z,
      },
      render: motionMash,
    });

    scene.add(motionMash);
  } else if (
    board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x].object !=
      "none" &&
    board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x].object !=
      board[objPos.z][objPos.x].object
  ) {
    let result = killCell(
      obj,
      scene,
      board,
      remove,
      VariatePos[i].x,
      VariatePos[i].z
    );

    board = result.board;
    remove = result.remove;
  }

  return {
    board,
    remove,
  };
};

const stepVariations = (obj, scene, board, remove) => {
  // x - is left     x + is rigth
  // z - is top     z + is bottom

  // если мы смотрели вариации какой то фишки, убираем старые визуалы и делаем новые
  if (
    remove[0] &&
    remove[0].render.userData.pastPosition != obj.userData.position &&
    obj.userData.object != "select" &&
    obj.userData.object != "kill"
  ) {
    removeVariateCell(remove, scene, board);
    remove = [];
  }

  //делаем анализ ходов, пока что так, этот код будет изменен (4 хода)
  for (let i = 0; i < VariatePos.length; i++) {
    const objPos = obj.userData.position;

    // если мы не выходим за поля, продолжаем рендер
    if (
      board[objPos.z + VariatePos[i].z] &&
      board[objPos.z + VariatePos[i].z][objPos.x + VariatePos[i].x] &&
      board[objPos.z][objPos.x].object != "select" &&
      board[objPos.z][objPos.x].object != "kill"
    ) {
      let result = abilityStep(obj, scene, board, remove, i, "select");
      board = result.board;
      remove = result.remove;
    } else if (board[objPos.z][objPos.x].object == "select") {
      // если выбрали куда ходить, делаем ход и убираем вариации
      let result = setStep(obj, scene, board, remove);
      board = result.board;
      remove = result.remove;
      break;
    } else if (board[objPos.z][objPos.x].object == "kill") {
      console.log("kill");
      const cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16);
      const pastObj = board[objPos.z][objPos.x].render.userData.pastPosition;

      const cylinder = new THREE.Mesh(cylinderGeometry, obj.userData.material);
      cylinder.castShadow = true;
      cylinder.receiveShadow = true;
      cylinder.position.x = oneCell * (obj.userData.position.x - 3);
      cylinder.position.z = oneCell * (obj.userData.position.z - 3);
      cylinder.userData.object = obj.userData.pastObject;
      cylinder.userData.position = { x: objPos.x, z: objPos.z };

      scene.remove(board[pastObj.z][pastObj.x].render);
      scene.remove(board[objPos.z][objPos.x].render);
      scene.remove(
        board[objPos.z - obj.userData.move.z][objPos.x - obj.userData.move.x]
          .render
      );

      removeVariateCell(remove, scene, board);

      board[pastObj.z][pastObj.x] = {
        position: {
          x: pastObj.x,
          z: pastObj.z,
        },
        object: "none",
      };

      board[objPos.z - obj.userData.move.z][objPos.x - obj.userData.move.x] = {
        position: {
          x: objPos.x - obj.userData.move.x,
          z: objPos.z - obj.userData.move.z,
        },
        object: "none",
      };

      board[objPos.z][objPos.x] = {
        position: {
          x: objPos.x,
          z: objPos.z,
        },
        object: obj.userData.pastObject,
        render: cylinder,
      };

      remove = [];
      scene.add(cylinder);
      break;
    }
  }
  return { board, remove };
};
