import { socket } from "./io";

export var players = {};

socket.on("position", (data) => {
  players = data;
});
