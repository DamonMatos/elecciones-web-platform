import { Injectable } from '@angular/core';
import { MenuResponse } from '../../features/usuario/registro/models/menu.model';
import { UsuarioMenuResponse, UsuarioResponse } from '../../features/usuario/registro/models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {

  private readonly TOKEN_KEY = 'token';
  private readonly USER_KEY  = 'user';
  private readonly MENU_KEY  = 'menu';
  private readonly EXPIRY_KEY = 'expiry';
  
  saveSession(response: UsuarioMenuResponse): void {
    if (!response.token) return;

    localStorage.setItem(this.TOKEN_KEY,  response.token);
    localStorage.setItem(this.EXPIRY_KEY, response.expiry ?? '');
    localStorage.setItem(this.USER_KEY,   JSON.stringify(response.user));
    localStorage.setItem(this.MENU_KEY,   JSON.stringify(response.menu));
  }

  getToken(): string | null { 
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): UsuarioResponse | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    const users: UsuarioResponse = JSON.parse(raw);
    return users ?? null;
  }

  getMenu(): MenuResponse[] {
    const raw = localStorage.getItem(this.MENU_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  getExpiry(): Date | null {
    const raw = localStorage.getItem(this.EXPIRY_KEY);
    return raw ? new Date(raw) : null;
  }

  isLoggedIn(): boolean {
      const token  = this.getToken();
      const expiry = this.getExpiry();
      if (!token || !expiry) return false;
      return new Date() < expiry; 
  }

  clearSession(): void {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.MENU_KEY);
      localStorage.removeItem(this.EXPIRY_KEY);
  }

}
