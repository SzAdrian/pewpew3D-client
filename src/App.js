import React, { useEffect, useState } from "react";
import "./App.css";
import initMovement from "./controll";
import { socket } from "./io";
import { players } from "./render";

function App() {
  const [modal, setModal] = useState(true);
  const [name, setName] = useState("");
  const [weapon, setWeapon] = useState("Pistol");
  useEffect(() => {
    document.querySelector("canvas").classList.add("blur");
  }, []);

  return (
    <>
      {modal && (
        <div className="modal">
          <form
            onSubmit={() => {
              setModal(false);
              document.querySelector("canvas").classList.remove("blur");
              socket.emit("setName", name);
              socket.emit("setWeapon", weapon);
            }}
          >
            <label>Name:</label>
            <input
              defaultValue={players[socket.id]}
              required
              type="text"
              value={name}
              pattern="[A-Za-z0-9]{3,10}"
              title="3-10 characters long"
              onChange={(event) => setName(event.target.value)}
            />
            <select onChange={(e) => setWeapon(e.target.value)}>
              <option value="Pistol">Pistol</option>
              <option value="Shotgun">Shotgun</option>
              <option value="SMG">SMG</option>
              <option value="Sniper">Sniper</option>
            </select>
          </form>
        </div>
      )}
    </>
  );
}
export default App;

initMovement();
