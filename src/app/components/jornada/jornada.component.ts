import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TimeService } from '../../services/time.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jornada',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.css']
})

export class JornadaComponent {
  private timeService = new TimeService(); 

  // Método para comenzar la jornada
  async startJornada() {
    try {
      // Mostrar cuadro de entrada con SweetAlert2
      const { value: code } = await Swal.fire({
        title: 'Introduce tu código de empleado',
        input: 'text',
        inputPlaceholder: 'Código de empleado...',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Debes ingresar un código!';
          }
          return null;
        }
      });

      // Si el usuario ingresó un código, llamamos a la API
      if (code) {
        const response = await this.timeService.startJornada(code);
        Swal.fire('Éxito', 'Jornada iniciada correctamente', 'success');
      }

    } catch (error) {
      // Verificar si el error tiene respuesta del servidor
      const errorMessage = (error as any)?.response?.data?.message || 'No se pudo pausar la jornada';
      Swal.fire('Error', errorMessage, 'error');
    }
  }

  async pauseJornada() {
    try {
      // Mostrar cuadro de entrada con SweetAlert2
      const { value: code } = await Swal.fire({
        title: 'Introduce tu código de empleado',
        input: 'text',
        inputPlaceholder: 'Código de empleado...',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Debes ingresar un código!';
          }
          return null;
        }
      });

      // Si el usuario ingresó un código, llamamos a la API
      if (code) {
        const response = await this.timeService.pauseJornada(code);
        Swal.fire('Éxito', 'Jornada pausada correctamente', 'success');
      }

    } catch (error) {
      // Verificar si el error tiene respuesta del servidor
      const errorMessage = (error as any)?.response?.data?.message || 'No se pudo pausar la jornada';
      Swal.fire('Error', errorMessage, 'error');
    }
  }

  // Método para finalizar la jornada
  async endJornada() {
    try {
      // Mostrar cuadro de entrada con SweetAlert2
      const { value: code } = await Swal.fire({
        title: 'Introduce tu código de empleado',
        input: 'text',
        inputPlaceholder: 'Código de empleado...',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return '¡Debes ingresar un código!';
          }
          return null;
        }
      });

      // Si el usuario ingresó un código, llamamos a la API
      if (code) {
        const response = await this.timeService.endJornada(code);
        Swal.fire('Éxito', 'Jornada finalizada correctamente', 'success');
      }

    } catch (error) {
      // Verificar si el error tiene respuesta del servidor
      const errorMessage = (error as any)?.response?.data?.message || 'No se pudo finalizar la jornada';
      Swal.fire('Error', errorMessage, 'error');
    }
  }
}
