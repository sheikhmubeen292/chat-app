import "dotenv/config";

import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cors from "cors";

const { MONGO_URI } = process.env;

async function main() {
  const app = express();
  app.use(cors());

  mongoose.connect(MONGO_URI, (err, conn) => {
    console.log(err ?? "connected with mongo atlas");
  });

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
      //to check the chat room and show it to frontend
      socket.to(data.room).emit("receive_message", data);
    });
  });

  return server;
}

main().then((app) => {
  const PORT = process.env.PORT || 5050;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});

process.on("uncaughtException", (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});
