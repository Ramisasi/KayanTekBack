import { Server } from "socket.io";
import { apiError } from "../middleware/errorHandle.js";

let io;
export const initIO = (httpServer) => {
  io = new Server(httpServer, {
    cors: "*",
  });
  return io;
};

export const getIo = () => {
  if (!io) {
    return new apiError("Fail to catch io", 400);
  } else {
    return io;
  }
};
