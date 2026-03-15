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

export const buildReplyEmailJob = (data: {
  to: string;
  name: string;
  message: string;
  relatedTo?: string;
}): EmailJobData => ({
  to: data.to,
  subject: "Eagle Heli Support Reply",
  templateData: {
    name: data.name,
    message: data.message,
    ...(data.relatedTo ? { relatedTo: data.relatedTo } : {}),
  },
  templateType: "reply",
});

export const buildNewsLetterSubscribeJob = (data: { to: string }): EmailJobData => ({
  to: data.to,
  subject: "Welcome to Eagle Heli Newsletter",
  templateData: {
    email: data.to,
  },
  templateType: "newsletter_subscribe",
});

export const buildNewsLetterBroadcastJob = (data: {
  to: string;
  subject: string;
  content: string;
  title?: string;
}): EmailJobData => ({
  to: data.to,
  subject: data.subject,
  templateData: {
    content: data.content,
    ...(data.title ? { title: data.title } : {}),
  },
  templateType: "newsletter_broadcast",
});
