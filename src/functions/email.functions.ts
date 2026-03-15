import { FlightBooking } from "../entities/booking.entity";
import { EmailJobData } from "../dto/interface";

export const buildBookingEmailJob = (booking: FlightBooking): EmailJobData => ({
  to: booking.email,
  subject:
    booking.status === "cancelled"
      ? "Flight Booking Cancelled"
      : booking.status === "pending"
      ? "Flight Booking Pending"
      : "Flight Booking Confirmation",
  templateData: {
    name: booking.bookedBy,
    flightNumber: booking.flightNumber,
    departure: booking.departure,
    destination: booking.destination,
    departureTime: booking.departureTime.toISOString(),
  },
  templateType: booking.status ?? "confirmed",
});

export const buildResetPasswordEmailJob = (data: {
  to: string;
  name: string;
  resetLink: string;
}): EmailJobData => ({
  to: data.to,
  subject: "Reset Your Eagle Heli Password",
  templateData: {
    name: data.name,
    resetLink: data.resetLink,
  },
  templateType: "reset_password",
});
