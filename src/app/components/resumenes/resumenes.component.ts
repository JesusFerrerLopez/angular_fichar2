import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-resumenes',
  imports: [CommonModule, FormsModule],
  templateUrl: './resumenes.component.html',
  styleUrl: './resumenes.component.css'
})
export class ResumenesComponent {
  // Variables para la vista
  nombreEmpleado: string;
  code: string;
  data: { [key: string]: any }[];
  jornadas: { Fecha: string; Entrada: string; Salida: string; Jornada: string; Fichaje: string }[];

  // Variables para el formulario
  startDate: string;
  endDate: string;

  constructor(private userService: UserService) {
    // Si la sesión no tiene código de empleado, redirigir a la página de inicio
    this.code = sessionStorage.getItem('code') || '';
    if (!this.code) {
      window.location.href = '/';
    }

    // Recuperamos la información de la sesión
    this.nombreEmpleado = sessionStorage.getItem('name') || '';

    // Recuperamos los datos enviados de la vista anterior o de haber vuelto a cargar la vista
    this.data = history.state.data;

    // Inicializamos las fechas del formuarlio usando el primer y último día de los datos
    this.startDate = this.data[0]['datetime'].split(' ')[0];
    this.endDate = this.data[this.data.length - 1]['datetime'].split(' ')[0];

    // Llamamos al método para procesar los datos
    this.jornadas = this.processData(this.data);
  }

  getResumen() {
    const startDateInput = document.querySelector('#startDate') as HTMLInputElement;
    const endDateInput = document.querySelector('#endDate') as HTMLInputElement;

    const startDate = new Date(startDateInput.value);
    const endDate = new Date(endDateInput.value);

    if (endDate < startDate) {
      // Si la fecha de fin es menor que la fecha de inicio, mostrar un mensaje de error
      document.querySelector('#error')!.innerHTML = 'La fecha de fin no puede ser menor que la fecha de inicio';
      return;
    } else {
      // Si la fecha de fin es correcta, ocultar el mensaje de error
      document.querySelector('#error')!.innerHTML = '';
    }

    // Llamamos al método para obtener las jornadas
    this.userService.getJornadas(this.code, this.startDate, this.endDate).then((response: any) => {
      this.data = response.times;
      this.jornadas = this.processData(this.data);
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

    // Comprobamos si la última jornada se ha cerrado correctamente y sí estamos en el mismo día de hoy.
    return jornadas;

  }
}
