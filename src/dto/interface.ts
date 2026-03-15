export interface UserPayload {
  id: number;
  email: string;
  role: string;
}



export interface EmailJobData {
  to: string;
  subject: string;
  templateData: BookingEmailTemplateData | ResetPasswordTemplateData;
  templateType: "confirmed" | "pending" | "cancelled" | "reset_password";
}

export interface BookingEmailTemplateData {
  name: string;
  flightNumber: string;
  departure: string;
  destination: string;
  departureTime: string;
}

export interface ResetPasswordTemplateData {
  name: string;
  resetLink: string;
}
