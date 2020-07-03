const mapSize = [800, 800];
const mapScale = 25;
const snakeSpawnPos = [
  [Math.floor(Math.random() * (mapSize[0]) / mapScale), Math.floor(Math.random() * (mapSize[1]) / mapScale)]
];
snakeSpawnPos.push(snakeSpawnPos[0].map((pos, i) => i===1? pos+1: pos))
const appleSpawnPos = [8, 3];
const speed = 100;
const compass = {
  38: [0, -1], // up
  40: [0, 1], // down
  37: [-1, 0], // left
  39: [1, 0], // right
  87: [0, -1], // up
  83: [0, 1], // down
  65: [-1, 0], // left
  68: [1, 0] // right
};

export {
  mapSize,
  snakeSpawnPos,
  appleSpawnPos,
  mapScale,
  speed,
  compass
};
