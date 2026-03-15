import { HttpStatusCode } from "../constant/statusCode.interface";

export type ServiceResult<T = unknown> = {
  status: HttpStatusCode;
  data?: T;
};
