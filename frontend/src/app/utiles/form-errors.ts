import { HttpErrorResponse } from '@angular/common/http';
import { ApiErrorResponse } from '../interfaces/api-error.interface';

export function mapApiErrors(err: HttpErrorResponse): Record<string, string> {
  const body = err.error as ApiErrorResponse | null;
  const result: Record<string, string> = {};

  for (const error of body?.errors ?? []) {
    result[error.path] = error.msg;
  }

  return result;
}
