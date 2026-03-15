export interface UserPayload {
  id: number;
  email: string;
}



export interface EmailJobData {
  to: string;
  subject: string;
  templateData: BookingEmailTemplateData;
}

export interface BookingEmailTemplateData {
  name: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureTime: string;
}
