import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import { FlightBooking } from "../entities/booking.entity";

let io: Server | null = null;

export const initSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;

export const emitBookingEvent = (event: "created" | "updated", booking: FlightBooking) => {
  if (!io) return;
  io.emit("booking:updated", {
    event,
    bookingId: booking.id,
    status: booking.status,
    data: booking,
  });
};
