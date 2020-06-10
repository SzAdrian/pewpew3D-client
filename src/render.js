import { socket } from "./io";
import { cursor } from "./controll";

var context = document.getElementById("game").getContext("2d");
export let players = {};
let walls = [];
const X = 320;
const Y = 240;
let offsetX = 0;
let offsetY = 0;
function drawBullets(data) {
  data.bullets.map((bullet) => {
    context.beginPath();
    context.fillStyle = bullet.socket === socket.id ? "green" : "black";
    context.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI);
    context.fill();
  });
}

function setAngle(player) {
  player.angle = getAngle(player.x, cursor.x, player.y, cursor.y);
  socket.emit("angle", player.angle);
}
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
//=====================================================================================================================================================
function drawWallsNew() {
  walls.map((wall) => {
    context.beginPath();
    context.lineWidth = 10;
    context.moveTo(wall.x1 - offsetX, wall.y1 - offsetY);
    context.lineTo(wall.x2 - offsetX, wall.y2 - offsetY);
    context.stroke();
  });
}

function drawGunNew(player) {
  context.beginPath();
  context.lineWidth = 2;
  context.moveTo(player.x - offsetX, player.y - offsetY);
  context.lineTo(
    player.x - offsetX + 20 * Math.cos((Math.PI * player.angle) / 180),
    player.y - offsetY + 20 * Math.sin((Math.PI * player.angle) / 180)
  );
  context.stroke();
}

function drawPlayerNew(player, id, offsetX, offsetY) {
  if (id === socket.id) {
    player.x = X;
    player.y = Y;
    offsetX = 0;
    offsetY = 0;
  }
  context.beginPath();
  context.arc(
    player.x - offsetX,
    player.y - offsetY,
    player.size,
    0,
    2 * Math.PI
  );
  drawName(id, player, offsetX, offsetY);
  drawHP(player, offsetX, offsetY);
}
function drawHP(player, offsetX, offsetY) {
  context.fillStyle = "red";
  context.fillText(
    `HP: ${player.health}`,
    player.x - offsetX - player.name.length * 3,
    player.y - offsetY + player.size * 2
  );
}

function drawName(id, player, offsetX, offsetY) {
  context.fillStyle = id === socket.id ? "green" : "black";
  context.fill();
  context.font = "12px Arial";
  context.fillText(
    player.name,
    player.x - offsetX - player.name.length * 3,
    player.y - offsetY - player.size * 2
  );
}

function setAngleNew(player) {
  player.angle = getAngle(X, cursor.x, Y, cursor.y);
  socket.emit("angle", player.angle);
}
function drawBulletsNew(data) {
  data.bullets.map((bullet) => {
    context.beginPath();
    context.fillStyle = bullet.socket === socket.id ? "green" : "black";
    context.arc(
      bullet.x - offsetX,
      bullet.y - offsetY,
      bullet.size,
      0,
      2 * Math.PI
    );
    context.fill();
  });
}
function render(data) {
  offsetX = data.players[socket.id].x - X;
  offsetY = data.players[socket.id].y - Y;

  clearCanvas();
  drawBulletsNew(data);
  drawWallsNew();
  Object.keys(data.players).map((id) => {
    let player = data.players[id];
    const isLocalPlayer = id === socket.id;
    if (isLocalPlayer) {
      setAngleNew(player);
    }
    drawGunNew(player);
    drawPlayerNew(player, id, offsetX, offsetY);
  });
}

socket.on("render", (data) => {
  players = data.players;
  render(data);
});

socket.on("map", (data) => {
  walls = data;
});
