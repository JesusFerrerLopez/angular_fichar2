import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-informes',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.css', '../estilos.css']
})

export class InformesComponent {
  @Input() workers: any[] = []; // Lista de empleados
  startDate: string = new Date().toISOString().split('T')[0];
  endDate: string = new Date().toISOString().split('T')[0]; // Fecha de inicio y fin por defecto

  // Empleados seleccionados
  selectedEmployees: any[] = [];

  constructor(private router: Router, private user: UserService) {}

  // Actualizar la lista de empleados seleccionados
  onSelectionChange(worker: any) {
    if (worker.selected) {
      // Si el trabajador se selecciona, lo agregamos a selectedEmployees
      this.selectedEmployees.push(worker);
    } else {
      // Si el trabajador se desmarca, lo eliminamos de selectedEmployees
      const index = this.selectedEmployees.indexOf(worker);
      if (index > -1) {
        this.selectedEmployees.splice(index, 1);
      }
    }
  }

  showDetails() {
    console.log('Detalles de los empleados seleccionados:', this.selectedEmployees);
  }

  /**
   * * Método que redirecciona el cliente a la página de resumenes del administrador, pudiendo visualizar
   * varios empleados a la vez.
   * * @param selectedEmployees Lista de empleados seleccionados
   * * @param startDate Fecha de inicio del resumen
   * * @param endDate Fecha de fin del resumen
   */
  showSummeries() {
    const validate = this.validateForm();
    if (!validate) {return;}

    console.log('Empleados seleccionados:', this.selectedEmployees);
    console.log('Fecha de inicio:', this.startDate);
    console.log('Fecha de fin:', this.endDate);

    const ids = this.selectedEmployees.map((employee) => employee.id);
    console.log('IDs de los empleados seleccionados:', ids);
    this.user.getTimes(ids, this.startDate, this.endDate).then(response => {
      const data = {
        workers: response,
        startDate: this.startDate,
        endDate: this.endDate
      };

      this.router.navigate(['/admin/informes'], { state: data });
    }).catch(error => {
      console.error('Error al obtener los tiempos:', error);
    });

    // const data = {
    //   selectedEmployees: this.selectedEmployees,
    //   startDate: this.startDate,
    //   endDate: this.endDate
    // };

    // this.router.navigate(['/admin/informes'], { state: data });
  }

  showExcel() {
    console.log('Empleados seleccionados:', this.selectedEmployees);
  }

  validateForm() {
    if (this.startDate > this.endDate) {
      alert('La fecha de inicio no puede ser mayor que la fecha de fin.');
      return false;
    }

    if (this.selectedEmployees.length === 0) {
      alert('Debes seleccionar al menos un empleado.');
      return false;
    }
    return true;
  }
}
