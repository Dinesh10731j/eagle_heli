export interface UserPayload {
  id: number;
  email: string;
  role: string;
  isVerified: boolean;
  name: string;
}



export interface EmailJobData {
  to: string;
  subject: string;
  templateData:
    | BookingEmailTemplateData
    | ResetPasswordTemplateData
    | ReplyEmailTemplateData
    | NewsLetterSubscribeTemplateData
    | NewsLetterBroadcastTemplateData;
  templateType:
    | "confirmed"
    | "pending"
    | "cancelled"
    | "reset_password"
    | "reply"
    | "newsletter_subscribe"
    | "newsletter_broadcast";
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

export interface ReplyEmailTemplateData {
  name: string;
  message: string;
  relatedTo?: string;
}

export interface NewsLetterSubscribeTemplateData {
  email: string;
}

export interface NewsLetterBroadcastTemplateData {
  title?: string;
  content: string;
}
