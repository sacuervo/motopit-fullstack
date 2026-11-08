import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../utiles/api';
import { AuthService } from './auth.service';
import { Moto, MotoPayload } from '../interfaces/moto.interface';
import { MessageResponse } from '../interfaces/api-error.interface';

@Injectable({
  providedIn: 'root',
})
export class MotoService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly url = `${API_URL}/motos`;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  getAll(): Observable<Moto[]> {
    return this.http.get<Moto[]>(this.url, { headers: this.getHeaders() });
  }

  getById(id: string): Observable<Moto> {
    return this.http.get<Moto>(`${this.url}/${id}`, { headers: this.getHeaders() });
  }

  create(data: MotoPayload): Observable<Moto> {
    return this.http.post<Moto>(this.url, data, { headers: this.getHeaders() });
  }

  update(id: string, data: MotoPayload): Observable<Moto> {
    return this.http.put<Moto>(`${this.url}/${id}`, data, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.url}/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
