import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TimeService } from '../../services/time.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-jornada',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  providers: [TimeService, UserService]
})

export class InicioComponent {

  // Motivos de pausa
  private pauseReasons = [
    'Desayuno',
    'Comida',
    'Médico',
    'Personal',
    'Otro'
  ];
  isMenuVisible = false; 
  menuPosition: { [key: string]: string } = {};

  constructor(
    private router: Router,
    private timeService: TimeService,
    private userService: UserService
  ) {
    // Borramos la información de la sesión
    sessionStorage.removeItem('code');
    sessionStorage.removeItem('name');
    sessionStorage.removeItem('rol');
    sessionStorage.removeItem('id');
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
      this.showError(error, 'No se pudo iniciar la jornada');
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
      this.showError(error, 'No se pudo pausar la jornada');
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
      this.showError(error, 'No se pudo finalizar la jornada');
    }
  }

  // Método de informes que solicita el código al usuario y nos lleva a la vista de informes
  async informes() {
    try {
      // Método que solicita el código al usuario
      const code = await this.getCode();
      
      // Si el usuario no ingresó un código, no hacemos nada
      if (!code) { return; } 

      // Comprobamos si el código es correcto usando el userService
      const user = await this.userService.getUser(code);

      // Si el usuario existe, asignamos el código y el nombre a la sesión
      if (!user) { Swal.fire('Error', 'Código de empleado incorrecto', 'error'); return; }

      sessionStorage.setItem('code', code);
      sessionStorage.setItem('id', user.id);
      sessionStorage.setItem('name', user.name);
      sessionStorage.setItem('role', user.role);
      this.router.navigate(['/informes']);

    } catch (error) {
      // Si el error es una instancia de HttpErrorResponse
      this.showError(error, 'No se pudo obtener el usuario');
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

  /**
     * Mensaje de error que recibe el error y un mensaje alternativo.
     * 
     * @param error Error que se recibe de la API.
     * @param errorAlternativeMessage Mensaje alternativo que se muestra si no se encuentra un usuario.
     */
  showError(error: any, errorAlternativeMessage: string) {
    if (error instanceof HttpErrorResponse) {
      const errorMessage = error.error?.message || errorAlternativeMessage;
      Swal.fire('Error', errorMessage, 'error');
    } else {
      // Si no es un HttpErrorResponse, se maneja como un error general
      Swal.fire('Error', 'Ocurrió un error desconocido', 'error');
    }
  }

  // ************************ ESTO NO FUNCIONA ***********************
  toggleMenu(event: MouseEvent) {
    this.isMenuVisible = !this.isMenuVisible;

    if (this.isMenuVisible) {
      const button = event.target as HTMLElement;
      const buttonRect = button.getBoundingClientRect();
      this.menuPosition = {
        top: `${buttonRect.top - 10}px`,  // Ajusta la posición como necesites
        left: `${buttonRect.left}px`
      };
    }
  }
  
  // Método para cerrar sesión
  logout() {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Método para enviar a la vista de administración
  async admin() {
    try {
      // Método que solicita el código al usuario
      const code = await this.getCode();

      // Si el usuario no ingresó un código, no hacemos nada
      if (!code) { return; } 

      // Comprobamos si el código es correcto usando el userService
      const user = await this.userService.getUser(code);

      // Si el usuario existe y es admin, asignamos el código y el nombre a la sesión
      if (!user) { Swal.fire('Error', 'Código de empleado incorrecto', 'error'); return; }
      if (user.rol !== 'admin') { Swal.fire('Error', 'No tienes permisos para acceder a esta sección', 'error'); return; }

      sessionStorage.setItem('code', code);
      sessionStorage.setItem('name', user.name);
      sessionStorage.setItem('rol', user.rol);

      this.router.navigate(['/admin']);

    } catch (error) {
      // Si el error es una instancia de HttpErrorResponse
      this.showError(error, 'No se pudo obtener el usuario');
    }
  }
}
