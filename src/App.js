import React, { useEffect, useState } from "react";
import "./App.css";
import initMovement from "./controll";
import { socket } from "./io";
import { players } from "./render";

function App() {
  const [modal, setModal] = useState(true);
  const [name, setName] = useState("");
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
          </form>
        </div>
      )}
    </>
  );
}
export default App;

initMovement();
