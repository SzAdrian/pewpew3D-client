import { socket } from "./io";
import { players } from "./players";
import { cursor } from "./controll";

var context = document.getElementById("game").getContext("2d");

export function getAngle(x1, x2, y1, y2) {
  return 180 - Math.atan2(y1 - y2, x1 - x2) * (180 / Math.PI) * -1;
}
function render(players) {
  context.clearRect(
    0,
    0,
    document.getElementById("game").width,
    document.getElementById("game").height
  );

  Object.keys(players).map((id) => {
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
  render(data);
});
