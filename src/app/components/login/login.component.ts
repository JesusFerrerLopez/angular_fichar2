import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  AuthServiceService: AuthServiceService;

  constructor() {
    // Si ya hay un usuario en la sesión, redirigir a la página de inicio
    if (sessionStorage.getItem('email')) {
      window.location.href = '/';
    }

    // Inicializar el servicio de autenticación
    this.AuthServiceService = new AuthServiceService();
  }

  async login() {
    // Comprobamos que el email y la contraseña no estén vacíos
    if (this.email === '' || this.password === '') {
      alert('Por favor, introduce tu email y contraseña.');
      return;
    }

    const response = await this.AuthServiceService.login(this.email, this.password);

    // Si hay un error en el login, mostrar un mensaje de error
    if (response.error) {
      alert('Error al iniciar sesión: ' + response.error);
      return;
    }

    // En el caso de que el login sea correcto, guardamos el email y el token en la sesión
    sessionStorage.setItem('email', this.email);
    sessionStorage.setItem('token', response.token);
    window.location.href = '/';
    }
}
