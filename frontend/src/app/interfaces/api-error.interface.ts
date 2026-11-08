export interface ValidationError {
  msg: string;
  path: string;
  type?: string;
  value?: unknown;
  location?: string;
}

export interface ApiErrorResponse {
  message?: string;
  errors?: ValidationError[];
}

export interface MessageResponse {
  message: string;
}
