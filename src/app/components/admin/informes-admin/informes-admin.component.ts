import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-informes-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './informes-admin.component.html',
  styleUrl: './informes-admin.component.css'
})
export class InformesAdminComponent {
  workers: any[] = []; // Trabajadores sin jornadas procesadas
  startDate: string = '';
  endDate: string = '';
  workersWithJornadas: any[] = [];

  constructor(private user:UserService) {}

  ngOnInit(): void {
    // Recoger los datos enviados mediante el estado
    const state = history.state;
    this.workers = state.workers.workers || [];
    this.startDate = state.startDate || '';
    this.endDate = state.endDate || '';

    this.saveWorkerTimes();

  }

  /**
   * Método que recibe el array de las ids de los trabajadores y fecha de inicio y fin
   * y devuelve un json con los datos de los trabajadores y sus jornadas en el rango de fechas
   * @param workers Array de ids de los trabajadores
   * @param startDate Fecha de inicio 
   * @param endDate Fecha de fin
   * @returns Json con los datos de los trabajadores y sus jornadas
   */
  getResumenes() {
    const validate = this.validateForm();
    if (!validate) {return;}

    const ids = this.workers.map((employee) => employee.id);

    this.user.getTimes(ids, this.startDate, this.endDate).then(response => {
      // Volvemos a procesar los datos de los trabajadores y sus jornadas
      this.workers = response.workers || [];
      this.saveWorkerTimes();
    });
  }

  saveWorkerTimes() {
    // Limpiamos la lista de trabajadores con jornadas
    this.workersWithJornadas = [];
    // Procesamos los times de cada trabajador  y los guardamos en la lista de trabajadores con jornadas
    this.workers.forEach((worker: any) => {
      const jornadas = this.processData(worker.times);
      this.workersWithJornadas.push({
        ...worker,
        jornadas: jornadas
      });
    });
  }

  // Método para procesar los datos
  processData(data: any): { Fecha: string; Entrada: string; Salida: string; Jornada: string; Fichaje: string }[] {
    let datos = data;

    if (!datos || datos.length === 0) {
      return [];
    }

    // Ordenamos los datos por fecha empezando por el más antiguo
    datos = datos.sort((a: any, b: any) => {
      return a.datetime > b.datetime ? 1 : -1;
    });

    // Vamos a recorrer las jornadas y agrupar por filas
    const jornadas: { Fecha: string; Entrada: string; Salida: string; Jornada: string; Fichaje: string }[] = [];
    let newJornada = {
      'Fecha': '',
      'Entrada': '',
      'Salida': '',
      'Jornada': '',
      'Fichaje': '' 
    };

    // newJornadaDay almacena el día de la jornada actual
    // Su valor por defecto es el día del primer objeto de datos
    let newJornadaDay = datos[0].date;
    let lastType = '';

    data.forEach((jornada: any) => {
      // Obtenemos la fecha y la hora usando el datetime de la jornada
      const date = jornada.datetime.split(' ')[0];
      const time = jornada.datetime.split(' ')[1];

      // Si la jornada es de un día diferente a la jornada actual, guardamos la jornada actual y creamos una nueva
      if (date !== newJornadaDay) {
        newJornadaDay = date;
      }

      // Si el tipo de la jornada es play y en la nueva jornada no hay entrada, guardamos la entrada
      if (jornada.type === 'play' && !newJornada.Entrada) {
        // Si la jornada anterior no se finalizó correctamente, terminamos la jornada anterior
        if (lastType === 'play') {
          newJornada.Salida = 'Sin salida';

          // La jornada por defecto es de 8 horas
          newJornada.Jornada = '08:00:00';

          newJornada.Fichaje = '<i class="fa-solid fa-triangle-exclamation"></i> Jornada sin finalizar';

          jornadas.push(newJornada);
          newJornada = {
            'Fecha': '',
            'Entrada': '',
            'Salida': '',
            'Jornada': '',
            'Fichaje': ''
          };
        } else {
          newJornada.Fecha = date;
          newJornada.Entrada = time;
          lastType = jornada.type;
        }
      }

      // Si el tipo de jornada es stop añadimos la nueva jornada y reiniciamos la jornada actual
      if (jornada.type === 'stop') {
        newJornada.Salida = time;

        // Calculamos el fichaje en función de la entrada y la salida
        const entrada = new Date(`2021-01-01T${newJornada.Entrada}`);
        const salida = new Date(`2021-01-01T${newJornada.Salida}`);
        const diff = (salida.getTime() - entrada.getTime()) / 1000;
        const horas = Math.floor(diff / 3600);
        const minutos = Math.floor((diff % 3600) / 60);
        const segundos = Math.floor(diff % 60);

        // La jornada por defecto es de 8 horas
        newJornada.Jornada = '08:00:00';

        newJornada.Fichaje = `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;

        jornadas.push(newJornada);
        newJornada = {
          'Fecha': '',
          'Entrada': '',
          'Salida': '',
          'Jornada': '',
          'Fichaje': ''
        };

        lastType = jornada.type;
      }
    });

    return jornadas;
  }

  validateForm() {
    if (this.startDate > this.endDate) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return false;
    }
    return true;
  }
}
