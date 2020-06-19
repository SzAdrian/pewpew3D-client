import React from "react";
import { useState } from "react";
import { createContext } from "react";

export const PlayerContext = createContext();

export function PlayerProvider(props) {
  const [player, setPlayer] = useState({});

  return (
    <PlayerContext.Provider value={(player, setPlayer)}>
      {props.children}
    </PlayerContext.Provider>
  );
}

export default PlayerContext;
