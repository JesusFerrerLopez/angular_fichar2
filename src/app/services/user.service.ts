import axios from 'axios';

export class UserService {
  // URL de la API
  private apiUrl = 'http://fichar2.local/api/v1/';

  // Método que recibe un código y devuelve el usuario correspondiente
  async getUser(code: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}user`, { params: { code } });
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw error;
    }
  }

  // Método que recibe un código y dos fechas y devuelve las jornadas correspondientes
  async getJornadas(code: string, start_date: string, end_date: string): Promise<any> {
    try {
      const response = await axios.get(`${this.apiUrl}jornadas/resumen`, { params: { code, start_date, end_date } });
      return response.data;
    } catch (error) {
      console.error('Error al obtener jornadas:', error);
      throw error;
    }
  }
}
