export const bookingPendingTemplate = (data: { name: string; flightNumber: string }) => `
  <h2>Booking Pending</h2>
  <p>Hi ${data.name},</p>
  <p>Your booking for flight <strong>${data.flightNumber}</strong> is pending.</p>
  <p>We will notify you once it is confirmed.</p>
`;
