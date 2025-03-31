import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { RouterOutlet } from '@angular/router';
import { TimeService } from '../../services/time.service';
import { UserService } from '../../services/user.service';
import { AuthInterceptor } from '../../services/auth.interceptor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-jornada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.css'],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})

export class JornadaComponent {
  private timeService;
  private userService;

  // Motivos de pausa
  private pauseReasons = [
    'Desayuno',
    'Comida',
    'Médico',
    'Personal',
    'Otro'
  ];

  constructor(private router: Router) {
    // Inicializar los servicios
    this.timeService = new TimeService;
    this.userService = new UserService;

    // Borramos la información de la sesión
    sessionStorage.removeItem('code');
    sessionStorage.removeItem('name');
  }

  // Método para comenzar la jornada
  async startJornada() {
    try {
      // Método que solicita el código al usuario
      const code = await this.getCode();

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
      // Método que solicita el código al usuario
      const code = await this.getCode();

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
      // Método que solicita el código al usuario
      const code = await this.getCode();

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

  // Método de informes que solicita el código al usuario y nos lleva a la vista de informes
  async informes() {
    try {
      // Método que solicita el código al usuario
      const code = await this.getCode();

      // Si el usuario ingresó un código, nos lleva a la vista de informes
      if (code) {
        // Comprobamos si el código es correcto usando el userService
        const user = await this.userService.getUser(code);

        // Si el usuario existe, asignamos el código y el nombre a la sesión
        if (user) {
          sessionStorage.setItem('code', code);
          sessionStorage.setItem('name', user.name);
          this.router.navigate(['/informes']);
        } else {
          Swal.fire('Error', 'Código de empleado incorrecto', 'error');
        }
      }

    } catch (error) {
      // Verificar si el error tiene respuesta del servidor
      const errorMessage = (error as any)?.response?.data?.message || 'No se pudo acceder a los informes';
      Swal.fire('Error', errorMessage, 'error');
    }
  }

  // Método que pide el código al usuario. Es una función local y no se usa en la API
  async getCode() {
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

    if (code) {
      return code;
    }
  }
  
}
