import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterOutlet } from '@angular/router';
import { TimeService } from '../../services/time.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jornada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.css']
})

export class JornadaComponent {
  private timeService = new TimeService(); 

  // Motivos de pausa
  private pauseReasons = [
    'Desayuno',
    'Comida',
    'Médico',
    'Personal',
    'Otro'
  ];

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

  // Método para pausar la jornada
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

      // Si el usuario ingresó un código, le pedimos el motivo de la pausa
      if (code) {
        // Mostrar cuadro con un selector desplegable de motivos de la pausa
        const { value: pause_reason } = await Swal.fire({
          title: 'Selecciona el motivo de la pausa',
          input: 'select',
          inputOptions: this.pauseReasons.reduce((acc: Record<string, string>, reason) => {
            acc[reason] = reason;
            return acc;
          }, {} as Record<string, string>),
          inputPlaceholder: 'Seleccione un motivo',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            if (!value) {
              return '¡Debes seleccionar un motivo!';
            }
            return null;
          }
        });

        // Si el usuario seleccionó un motivo, llamamos a la API
        if (pause_reason) {
          const response = await this.timeService.pauseJornada(code, pause_reason);
          Swal.fire('Éxito', 'Jornada pausada correctamente', 'success');
        };
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
