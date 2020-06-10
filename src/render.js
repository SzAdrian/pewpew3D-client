import { socket } from "./io";
import { cursor } from "./controll";

var context = document.getElementById("game").getContext("2d");
export let players = {};
let walls = [
  { x1: 100, y1: 0, x2: 100, y2: 100 },
  { x1: 100, y1: 100, x2: 300, y2: 100 },
  { x1: 300, y1: 100, x2: 300, y2: 400 },
];
const X = 320;
const Y = 240;

function drawWalls() {
  walls.map((wall) => {
    context.beginPath();
    context.lineWidth = 10;
    context.moveTo(wall.x1 - 5, wall.y1 - 5);
    context.lineTo(wall.x2, wall.y2);
    context.stroke();
  });
}
function drawPlayer(player, id) {
  context.beginPath();
  context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
  context.fillStyle = id === socket.id ? "green" : "black";
  context.fill();
  context.font = "12px Arial";
  context.fillText(
    player.name,
    player.x - player.name.length * 3,
    player.y - 20
  );
  context.fillStyle = "red";
  context.fillText(
    `HP: ${player.health}`,
    player.x - player.name.length * 3,
    player.y + 20
  );
}
function drawPlayerNew(player, id, offsetX, offsetY) {
  if (id === socket.id) {
    player.x = X;
    player.y = Y;
    offsetX = 0;
    offsetY = 0;
  }
  context.beginPath();
  context.arc(player.x - offsetX, player.y - offsetY, 10, 0, 2 * Math.PI);
  context.fillStyle = id === socket.id ? "green" : "black";
  context.fill();
  context.font = "12px Arial";
  context.fillText(
    player.name,
    player.x - offsetX - player.name.length * 3,
    player.y - offsetY - 20
  );

  context.fillStyle = "red";
  context.fillText(
    `HP: ${player.health}`,
    player.x - offsetX - player.name.length * 3,
    player.y - offsetY + 20
  );
}

function drawGun(player) {
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(player.x, player.y);
  context.lineTo(
    player.x + 20 * Math.cos((Math.PI * player.angle) / 180),
    player.y + 20 * Math.sin((Math.PI * player.angle) / 180)
  );
  context.stroke();
}

function drawGunNew(player, offsetX, offsetY) {
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(player.x - offsetX, player.y - offsetY);
  context.lineTo(
    player.x - offsetX + 20 * Math.cos((Math.PI * player.angle) / 180),
    player.y - offsetY + 20 * Math.sin((Math.PI * player.angle) / 180)
  );
  context.stroke();
}

function clearCanvas() {
  context.clearRect(
    0,
    0,
    document.getElementById("game").width,
    document.getElementById("game").height
  );
}

export function getAngle(x1, x2, y1, y2) {
  return 180 - Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI) * -1;
}
function render(data) {
  let offsetX = data.players[socket.id].x - X;
  let offsetY = data.players[socket.id].y - Y;

  clearCanvas();
  drawBulletsNew(data, offsetX, offsetY);
  //drawBullets(data);
  //drawWalls();

  Object.keys(data.players).map((id) => {
    let player = data.players[id];

    const isLocalPlayer = id === socket.id;
    if (isLocalPlayer) {
      setAngleNew(player);
      //setAngle(player);
    }

    //drawGun(player);
    //drawPlayer(player, id);
    drawGunNew(player, offsetX, offsetY);
    drawPlayerNew(player, id, offsetX, offsetY);
  });
}

socket.on("render", (data) => {
  players = data.players;
  render(data);
});
function drawBullets(data) {
  data.bullets.map((bullet) => {
    context.beginPath();
    context.fillStyle = bullet.socket === socket.id ? "green" : "black";
    context.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI);
    context.fill();
  });
}
function drawBulletsNew(data, offsetX, offsetY) {
  data.bullets.map((bullet) => {
    context.beginPath();
    context.fillStyle = bullet.socket === socket.id ? "green" : "black";
    context.arc(bullet.x - offsetX, bullet.y - offsetY, 3, 0, 2 * Math.PI);
    context.fill();
  });
}

function setAngle(player) {
  player.angle = getAngle(player.x, cursor.x, player.y, cursor.y);
  socket.emit("angle", player.angle);
}

function setAngleNew(player) {
  player.angle = getAngle(X, cursor.x, Y, cursor.y);
  socket.emit("angle", player.angle);
}
