import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../utiles/api';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/auth.interface';

const TOKEN_KEY = 'token';
const NOMBRE_KEY = 'nombre';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/auth`;

  readonly loggedIn = signal<boolean>(this.hasValidToken());
  readonly nombre = signal<string | null>(sessionStorage.getItem(NOMBRE_KEY));

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.url}/register`, data);
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.url}/login`, data);
  }

  saveSession(token: string, nombre: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(NOMBRE_KEY, nombre);
    this.loggedIn.set(true);
    this.nombre.set(nombre);
  }

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn() {
    if (this.loggedIn() && !this.hasValidToken()) {
      this.logout();
    }
    return this.loggedIn();
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(NOMBRE_KEY);
    this.loggedIn.set(false);
    this.nombre.set(null);
  }

  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    try {
      const payloadBase64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(payloadBase64)) as { exp: number };
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
}
