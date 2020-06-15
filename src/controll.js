import { socket } from "./io";
import { getAngle, players } from "./render";

export let cursor = { x: 0, y: 0 };

export default function initMovement() {
  const move = (direction) => {
    players[socket.id].moves[direction] = true;
    socket.emit("move", direction);
  };

  const stop = (direction) => {
    players[socket.id].moves[direction] = false;
    socket.emit("stop", direction);
  };

  window.addEventListener("keydown", (e) => {
    // eslint-disable-next-line default-case
    switch (e.keyCode) {
      case 16:
        if (!players[socket.id].moves["walk"]) {
          move("walk");
        }
        break;

      case 87:
        if (!players[socket.id].moves["up"]) {
          move("up");
        }
        break;

      case 83:
        if (!players[socket.id].moves["down"]) {
          move("down");
        }
        break;

      case 68:
        if (!players[socket.id].moves["right"]) {
          move("right");
        }
        break;

      case 65:
        if (!players[socket.id].moves["left"]) {
          move("left");
        }
        break;
    }
  });

  document.addEventListener("keyup", (e) => {
    // eslint-disable-next-line default-case
    switch (e.keyCode) {
      case 16:
        stop("walk");
        break;
      case 87:
        stop("up");
        break;

      case 83:
        stop("down");
        break;

      case 68:
        stop("right");
        break;

      case 65:
        stop("left");
        break;
    }
  });

  window.addEventListener("mousemove", (e) => {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
    if (players[socket.id]) {
      players[socket.id].angle = getAngle(
        players[socket.id].x,
        e.clientX,
        players[socket.id].y,
        e.clientY
      );
    }
  });

  function fire() {
    socket.emit("shoot");
  }
  var ableToFire = true;

  window.addEventListener("click", (e) => {
    if (ableToFire) {
      fire();
      ableToFire = false;
      setTimeout(() => {
        ableToFire = true;
      }, 200);
    }
  });

  var interval;
  window.addEventListener("mousedown", function () {
    clearInterval(interval);
    interval = setInterval(() => fire(), 300);
  });

  window.addEventListener("mouseup", function () {
    clearInterval(interval);
  });

  window.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });
}
