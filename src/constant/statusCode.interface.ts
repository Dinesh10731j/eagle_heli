export const HTTP_STATUS = {


  // 2xx Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,

  // 4xx Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,

  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: 500,

} as const

export type HttpStatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];


