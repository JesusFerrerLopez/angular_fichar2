import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-informes',
  imports: [FormsModule],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent {
  private userService;

  startDate: string;
  endDate: string;
  employeeCode: string;

  constructor(private router: Router) {
    // Establecer el código de empleado desde la sesión
    this.employeeCode = sessionStorage.getItem('code') || '';

    // Si no hay código de empleado, redirigir a la página de inicio
    if (!this.employeeCode) {
      window.location.href = '/';
    }

    // Establecer la fecha actual en el formato yyyy-mm-dd
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = (today.getMonth() + 1).toString().padStart(2, '0');
    const dd = today.getDate().toString().padStart(2, '0');

    const todayString = `${yyyy}-${mm}-${dd}`;

    // Establecer las fechas por defecto
    this.startDate = todayString;
    this.endDate = todayString;

    this.userService = new UserService;
  }

  // Esto se ejecuta cuando se envía el formulario
  async onSubmit() {
    // Validar que las fechas sean correctas
    if (this.startDate > this.endDate) {
      alert('La fecha de inicio no puede ser mayor a la fecha de fin');
      return;
    }

    // Llamar al servicio para obtener las jornadas
    const response = await this.userService.getJornadas(this.employeeCode, this.startDate, this.endDate);

    // Si la respuesta del servidor es exitosa, redirigir a la nueva vista pasando los datos
    this.router.navigate(['/informes/resumen'], { state: { data: response.times } });
  }
}
