import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  // URL de la API
  private apiUrl = 'http://fichar2.local/api/v1/';

  // Método de login
  async login(email: string, password: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}login`, { email, password });
      return response.data;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }
}
