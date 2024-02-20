const http = require("http");
const path = require("path");
const express = require("express");
const { Server } = require("socket.io");

require("dotenv").config();

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let socketsConected = new Set();

io.on("connection", (socket) => {
  
  console.log("Socket connected", socket.id);
  socketsConected.add(socket.id);
  io.emit("clients-total", socketsConected.size);
  socket.on("message", (data) => {
    console.log(data, "data");
    socket.broadcast.emit("chat-message", data);
  });
  socket.on("feedback", (data) => {
    socket.broadcast.emit("feedback", data);
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
    socketsConected.delete(socket.id);
    io.emit("clients-total", socketsConected.size);
  });
});

server.listen(PORT, () => {
  console.log(`SERVER LISTEN ${PORT}`);
});