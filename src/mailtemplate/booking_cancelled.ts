export const bookingCancelledTemplate = (data: { name: string; flightNumber: string }) => `
  <h2>Booking Cancelled</h2>
  <p>Hi ${data.name},</p>
  <p>Your booking for flight <strong>${data.flightNumber}</strong> has been cancelled.</p>
  <p>If this was a mistake, please contact support.</p>
`;
