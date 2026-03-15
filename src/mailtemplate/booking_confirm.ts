
export const emailBookingTemplate = (data: { name: string; flightNumber: string; departure: string; destination: string; departureTime: string }) => `
  <h2>Flight Booking Confirmation</h2>
  <p>Hi ${data.name},</p>
  <p>Your flight <strong>${data.flightNumber}</strong> has been booked successfully.</p>
  <p><strong>From:</strong> ${data.departure} <strong>To:</strong> ${data.destination}</p>
  <p><strong>Departure:</strong> ${data.departureTime}</p>
  <p>Thank you for choosing Eagle Heli!</p>
`;