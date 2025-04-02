import { HttpClient, HttpParams } from '@angular/common/http';
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

  // Método para eliminar trabajador
  async deleteWorker(code: string): Promise<any> {
    try {
      const response = await this.http.delete(`${this.apiUrl}user`, { params: { code } }).toPromise();
      return response;
    } catch (error) {
      console.error('Error al eliminar el empleado:', error);
      throw error;
    }
  }

  /**
   * * Método que devuelve los registros de varios empleados de times en un rango de fechas
   * * * @param workers Array de ids de los empleados
   * * * @param startDate Fecha de inicio del rango
   * * * @param endDate Fecha de fin del rango
   * * @returns Registros de los empleados
   */
  async getTimes(workers: number[], startDate: string, endDate: string): Promise<any> {
    try {
        let params = new HttpParams();
        
        // Agregar cada trabajador como un array en la URL
        workers.forEach(worker => {
            params = params.append('workers[]', worker.toString());
        });

        params = params.append('startDate', startDate);
        params = params.append('endDate', endDate);

        const response = await this.http
            .get(`${this.apiUrl}users/times`, { params })
            .toPromise();
        
        return response;
    } catch (error) {
        console.error('Error al obtener los tiempos:', error);
        throw error;
    }
}
}
