import React, { createContext, useEffect, useState, useCallback } from "react";
import { socket } from "./io";
export const GameContext = createContext();

function GameProvider(props) {
  return (
    <GameContext.Provider value={"asd"}>{props.children}</GameContext.Provider>
  );
}

export default GameProvider;
