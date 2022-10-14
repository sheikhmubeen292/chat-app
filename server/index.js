import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(socket.id, "hello");

  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    //just to receive_message and show it to frontend
    // socket.broadcast.emit("receive_message", data);

    //to check the chat room and show it to frontend
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(5050, () => {
  console.log("Server Start");
});
