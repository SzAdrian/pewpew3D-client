import { socket } from "./io";
import { cursor } from "./controll";

var canvas = document.getElementById("game");
var context = canvas.getContext("2d");
export let players = {};
let walls = [];
let X = canvas.width / 2;
let Y = canvas.height / 2;
let offsetX = 0;
let offsetY = 0;
let renderDist = 250;

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

export function getAngle(x1, x2, y1, y2) {
  return 180 - Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI) * -1;
}
//=====================================================================================================================================================
function isInRenderDistance(object) {
  var dist_points =
    (object.x - players[socket.id].x) * (object.x - players[socket.id].x) +
    (object.y - players[socket.id].y) * (object.y - players[socket.id].y);
  if (dist_points < renderDist * renderDist) {
    return true;
  }
  return false;
}

function drawWalls() {
  walls.map((wall) => {
    context.beginPath();
    context.lineWidth = 10;
    context.moveTo(wall.x1 - offsetX, wall.y1 - offsetY);
    context.lineTo(wall.x2 - offsetX, wall.y2 - offsetY);
    context.stroke();
  });
}

function drawGun(player) {
  if (player.weapon) {
    context.beginPath();
    context.lineWidth = 2;
    context.moveTo(player.x - offsetX, player.y - offsetY);
    context.lineTo(
      player.x - offsetX + 20 * Math.cos((Math.PI * player.angle) / 180),
      player.y - offsetY + 20 * Math.sin((Math.PI * player.angle) / 180)
    );
    context.stroke();
  }
}

function drawPlayer(player, id, offsetX, offsetY) {
  if (id === socket.id) {
    player.drawX = X;
    player.drawY = Y;
  } else {
    player.drawX = player.x - offsetX;
    player.drawY = player.y - offsetY;
  }

  context.beginPath();
  context.arc(player.drawX, player.drawY, player.size, 0, 2 * Math.PI);
  context.fillStyle = id === socket.id ? "green" : "black";
  context.fill();

  drawName(id, player);
  drawHP(player);
}
function drawHP(player) {
  context.fillStyle = "red";
  context.fillText(
    `HP: ${player.health}`,
    player.drawX - player.name.length * 3,
    player.drawY + player.size * 2
  );
}

function drawName(id, player) {
  context.fillStyle = id === socket.id ? "green" : "black";
  context.fill();
  context.font = "12px Arial";
  context.fillText(
    player.name,
    player.drawX - player.name.length * 3,
    player.drawY - player.size * 2
  );
}

function setAngle(player) {
  player.angle = getAngle(X, cursor.x, Y, cursor.y);
  socket.emit("angle", player.angle);
}
function drawBullets(data) {
  data.bullets.map((bullet) => {
    if (isInRenderDistance(bullet)) {
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
    }
  });
}

function render(data) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  X = canvas.width / 2;
  Y = canvas.height / 2;
  offsetX = data.players[socket.id].x - X;
  offsetY = data.players[socket.id].y - Y;

  clearCanvas();
  drawBullets(data);
  drawWalls();
  Object.keys(data.players).map((id) => {
    let player = data.players[id];
    const isLocalPlayer = id === socket.id;
    if (isLocalPlayer) {
      setAngle(player);
    }
    if (isLocalPlayer || isInRenderDistance(player)) {
      drawGun(player);
      drawPlayer(player, id, offsetX, offsetY);
    }
  });
}

socket.on("render", (data) => {
  players = data.players;
  render(data);
});

socket.on("map", (data) => {
  walls = data;
});
