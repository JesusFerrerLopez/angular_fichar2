import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

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

  // Esto se ejecuta después de que la vista se haya inicializado
  ngAfterViewInit(): void {
    // Evento que comprueba que la fecha de fin no sea menor que la fecha de inicio
    const endDateInput = document.querySelector('#endDate') as HTMLInputElement;
    const startDateInput = document.querySelector('#startDate') as HTMLInputElement;

    const validateDates = () => {
      const startDate = new Date(startDateInput.value);
      const endDate = new Date(endDateInput.value);

      if (endDate < startDate) {
        // Si la fecha de fin es menor que la fecha de inicio, mostrar un mensaje de error
        document.querySelector('#error')!.innerHTML = 'La fecha de fin no puede ser menor que la fecha de inicio';
      } else {
        // Si la fecha de fin es correcta, ocultar el mensaje de error
        document.querySelector('#error')!.innerHTML = '';
      }
    };

    validateDates.bind(this);

    startDateInput.addEventListener('change', validateDates);
    endDateInput.addEventListener('change', validateDates);
  }

  // Esto se ejecuta cuando se envía el formulario
  async onSubmit() {
    // Validar que las fechas sean correctas
    if (this.startDate > this.endDate) {
      Swal.fire({
        icon: 'error',
        title: 'Fechas incorrectas',
        text: 'La fecha de inicio no puede ser mayor que la fecha de fin',
      });
      return;
    }

    // this.startDate = '1234-01-01'; // Cambiar a la fecha de inicio

    // Llamar al servicio para obtener las jornadas
    const response = await this.userService.getJornadas(this.employeeCode, this.startDate, this.endDate);

    // Si la respuesta está vacía, mostrar un mensaje de error
    if (response.times.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Sin datos',
        text: 'No hay datos para las fechas seleccionadas',
      });
      return;
    }

    // Si la respuesta es exitosa, redirigir a la vista de resumenes
    this.router.navigate(['/informes/resumen'], { state: { data: response.times } });
  }
}
