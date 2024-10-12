const checkWinner = (grid, playerMove) => {
  let isWinner = false;
  let position = null;
  let isTied = true;

  for (let i = 0; i < 3; i++) {
    let count = 0;
    for (let j = 0; j < 3; j++) {
      if (grid[i][j] === 0) {
        isTied = false;
      }
      if (grid[i][j] === playerMove) {
        count++;
      }
    }
    position = `Row_${i}`;
    if (count === 3) {
      isWinner = true;
      break;
    }
  }
  if (isWinner) {
    return { isWinner: true, winCondition: position };
  }

  for (let i = 0; i < 3; i++) {
    let count = 0;
    for (let j = 0; j < 3; j++) {
      if (grid[j][i] === playerMove) {
        count++;
      }
    }
    position = `Column_${i}`;
    if (count === 3) {
      isWinner = true;
      break;
    }
  }
  if (isWinner) {
    return { isWinner: true, winCondition: position };
  }

  isWinner = true;
  let x = 0;
  let y = 0;
  while (x < 3 && y < 3) {
    if (grid[x][y] !== playerMove) {
      isWinner = false;
      break;
    }
    x++;
    y++;
  }
  if (isWinner) {
    return { isWinner: true, winCondition: "Diagonal Left" };
  }

  isWinner = true;
  x = 0;
  y = 2;
  while (x < 3 && y >= 0) {
    if (grid[x][y] !== playerMove) {
      isWinner = false;
      break;
    }
    x++;
    y--;
  }
  if (isWinner) {
    return { isWinner: true, winCondition: "Diagonal Right" };
  }
  if (!isWinner && isTied) {
    return { isTied: true };
  }

  return { isWinner: false };
};

module.exports = checkWinner;
