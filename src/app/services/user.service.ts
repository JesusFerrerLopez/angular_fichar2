import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // URL de la API
  private apiUrl = 'http://fichar2.local/api/v1/';

  constructor(private http: HttpClient) {}

  // Método que recibe un código y devuelve el usuario correspondiente
  async getUser(code: string): Promise<any> {
    try {
      const response = await this.http
        .get(`${this.apiUrl}user`, { params: { code } })
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Método que recibe un código y dos fechas y devuelve las jornadas correspondientes
  async getJornadas(code: string, start_date: string, end_date: string): Promise<any> {
    try {
      const response = await this.http
        .get(`${this.apiUrl}jornadas/resumen`, { params: { code, start_date, end_date } })
        .toPromise();
      return response;
    } catch (error) {
      console.error('Error al obtener jornadas:', error);
      throw error;
    }
  }

  // Método que recibe todos los empleados de la empresa logeada
  async getAllWorkers(): Promise<any> {
    try {
      const response = await this.http.get(`${this.apiUrl}users`).toPromise();
      return response;
    } catch (error) {
      console.error('Error al obtener todos los empleados:', error);
      throw error;
    }
  }

  // Método para actualizar
  async updateWorker(name: string, code: string, new_code: string): Promise<any> {
    try {
      console.log('Actualizando empleado:', { name, code, new_code });
      const response = await this.http.patch(`${this.apiUrl}user`, { name, code, new_code }).toPromise();
      return response;
    } catch (error) {
      console.error('Error al actualizar el empleado:', error);
      throw error;
    }
  }
}
