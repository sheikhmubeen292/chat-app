import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5050");

function App() {
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messageReceive, setMessageReceive] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = () => {
    socket.emit("send_message", { message, room });
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceive(data.message);
    });
  }, []);

  return (
    <div>
      <input placeholder="room..." onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom}>Join Room</button> <br />
      <input
        placeholder="messsage..."
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>Send Message</button>
      <h2>Message: {messageReceive}</h2>
    </div>
  );
}

export default App;
