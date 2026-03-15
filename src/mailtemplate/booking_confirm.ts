export const emailBookingTemplate = (data: {
  name: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureTime: string;
}) => {
  const timeZone = process.env.APP_TIMEZONE || "Asia/Kathmandu";
  const departure = new Date(data.departureTime);
  const formattedDeparture = Number.isNaN(departure.getTime())
    ? data.departureTime
    : new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone,
        timeZoneName: "short",
      }).format(departure);

  return `
  <div style="background:#eaf4ff;padding:24px;font-family:Arial,Helvetica,sans-serif;color:#0a2239">
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #cfe4ff">
      <div style="background:linear-gradient(90deg,#2f7edb,#73b3ff);padding:18px 22px;color:#ffffff">
        <div style="font-size:18px;font-weight:700;letter-spacing:0.5px">Eagle Heli</div>
        <div style="font-size:14px;opacity:0.9">Flight Ticket</div>
      </div>
      <div style="padding:22px">
        <div style="font-size:18px;font-weight:700;margin-bottom:6px">Booking Confirmed</div>
        <div style="font-size:14px;margin-bottom:16px">Hi ${data.name}, your flight is ready.</div>

        <div style="border:1px dashed #b7d4ff;border-radius:12px;padding:16px;background:#f7fbff">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div>
              <div style="font-size:12px;color:#4b6b88">From</div>
              <div style="font-size:18px;font-weight:700">${data.departure}</div>
            </div>
            <div style="font-size:20px;color:#2f7edb">&#9992;</div>
            <div style="text-align:right">
              <div style="font-size:12px;color:#4b6b88">To</div>
              <div style="font-size:18px;font-weight:700">${data.destination}</div>
            </div>
          </div>
          <div style="margin-top:12px;display:flex;justify-content:space-between;font-size:14px">
            <div><strong>Flight</strong> ${data.flightNumber}</div>
            <div><strong>Departure</strong> ${formattedDeparture}</div>
          </div>
        </div>

        <div style="margin-top:16px;font-size:14px;color:#4b6b88">
          Please arrive early with a valid ID. If you need help, reply to this email.
        </div>
      </div>
      <div style="padding:14px 22px;background:#f2f7ff;font-size:12px;color:#4b6b88">
        Thank you for choosing Eagle Heli.
      </div>
    </div>
  </div>
`;
};
