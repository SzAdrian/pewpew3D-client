import { socket } from "./io";
import { cursor } from "./controll";

var context = document.getElementById("game").getContext("2d");
let players = {};

export let renderPlayers = () => {
  requestAnimationFrame(renderPlayers);

  if (context) {
    clearCanvas();
    Object.keys(players).map((id) => {
      let player = players[id];
      if (id === socket.id) {
        player.angle = getAngle(player.x, cursor.x, player.y, cursor.y);
      }
      if (player.moves["up"]) {
        if (player.velY > -player.speed) {
          player.velY--;
        }
      }

      if (player.moves["down"]) {
        if (player.velY < player.speed) {
          player.velY++;
        }
      }
      if (player.moves["right"]) {
        if (player.velX < player.speed) {
          player.velX++;
        }
      }
      if (player.moves["left"]) {
        if (player.velX > -player.speed) {
          player.velX--;
        }
      }

      player.velY *= player.friction;
      player.y += player.velY;
      player.velX *= player.friction;
      player.x += player.velX;

      drawGun(player);
      drawPlayer(player, id);
    });
    socket.emit("update", players[socket.id]);
  }
};

function drawPlayer(player, id) {
  context.beginPath();
  context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
  context.fillStyle = id === socket.id ? "green" : "black";
  context.fill();
}

function drawGun(player) {
  context.beginPath();
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
function render(data) {
  context.clearRect(
    0,
    0,
    document.getElementById("game").width,
    document.getElementById("game").height
  );

  data.bullets.map((bullet) => {
    context.beginPath();
    context.arc(bullet.x, bullet.y, 3, 0, 2 * Math.PI);
    context.fill();
  });

  Object.keys(data.players).map((id) => {
    let player = players[id];
    if (id === socket.id) {
      player.angle = getAngle(player.x, cursor.x, player.y, cursor.y);
      socket.emit("angle", player.angle);
    }
    //draw gun
    context.beginPath();
    context.moveTo(player.x, player.y);
    context.lineTo(
      player.x + 20 * Math.cos((Math.PI * player.angle) / 180),
      player.y + 20 * Math.sin((Math.PI * player.angle) / 180)
    );
    context.stroke();
    //draw player
    context.beginPath();
    context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    context.fillStyle = id === socket.id ? "green" : "black";
    context.fill();
  });
}

socket.on("render", (data) => {
  players = data;
  render(data);
});
