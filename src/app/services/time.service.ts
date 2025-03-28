import axios from 'axios';

export class TimeService {
  // URL de la API
  private apiUrl = 'http://fichar2.local/api/v1/';

  // Métodos para interactuar con la API
  // Método de comienzo de la jornada
  async startJornada(code: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}play`, { code });
      return response.data;
    } catch (error) {
      console.error('Error al iniciar jornada:', error);
      throw error;
    }
  }

  // Método para pausar la jornada
  // HACE FALTA IMPLEMENTAR MOTIVO DE LA PAUSA
  async pauseJornada(code: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}pause`, { code });
      return response.data;
    } catch (error) {
      console.error('Error al pausar jornada:', error);
      throw error;
    }
  }

  // Método para finalizar la jornada
  async endJornada(code: string): Promise<any> {
    try {
      const response = await axios.post(`${this.apiUrl}stop`, { code });
      return response.data;
    } catch (error) {
      console.error('Error al finalizar jornada:', error);
      throw error;
    }
  }

  // async getTimes(): Promise<any> {
  //   try {
  //     const response = await axios.get(this.apiUrl);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error al obtener los tiempos:', error);
  //     throw error;
  //   }
  // }
}
