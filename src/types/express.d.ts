// src/types/express.d.ts
import { UserPayload } from "../dto/interface";

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
