import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-empleados',
  imports: [ CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})

export class EmpleadosComponent {
  @Input() workers: any[] = []; // Lista de empleados
  searchTerm: string = ''; // Término de búsqueda
  filteredWorkers: any[] = [];
  notFilteredWorkers: any[] = [];
  editingWorker: any = null; // Objeto para editar

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workers'] && this.workers.length > 0) {
      this.filterWorkers();
    }
  }

  filterWorkers() {
    const { filteredWorkers, notFilteredWorkers } = this.getFilteredWorkers();
    this.filteredWorkers = filteredWorkers;
    this.notFilteredWorkers = notFilteredWorkers;
  }  

  // Método que devuelve los que cumplen por un lado y los que no por otro
  getFilteredWorkers() {
    const filteredWorkers = this.workers.filter(worker => {
      return worker.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });

    const notFilteredWorkers = this.workers.filter(worker => {
      return !worker.name.toLowerCase().includes(this.searchTerm.toLowerCase());
    });

    return { filteredWorkers, notFilteredWorkers };
  }

  // Método de edición
  editar(worker: any) {
    this.editingWorker = { ...worker };
  }

  // Método para confirmar los cambios y salir del modo edición
  confirmarEdicion(worker: any) {
    // Encuentra el índice del trabajador editado
    const index = this.workers.findIndex(w => w.code === worker.code);
    
    // *********** HAY QUE VALIDAR LOS CAMPOS ***********
    if (index !== -1) {
      const response = this.userService.updateWorker(
        this.editingWorker.name,
        worker.code,
        this.editingWorker.code
      );

      // Actualiza los datos del trabajador con los cambios
      this.workers[index] = { ...this.editingWorker };

      this.filterWorkers(); // Filtra la lista de trabajadores después de la edición
    }

    // Salir del modo edición
    this.editingWorker = null;
  }

  // Método para cancelar la edición y salir del modo edición
  cancelarEdicion() {
    this.editingWorker = null;
  }

  // Método de eliminación
  eliminar(worker: any) {
    this.askConfirmation(worker).then((confirmation) => {
      if (!confirmation) {
      return;
      }
      // Aquí puedes agregar la lógica para eliminar al empleado
      console.log('Empleado eliminado:', worker);
    });
  }

  // Método para preguntar al usuario si está seguro de eliminar
  async askConfirmation(worker: any) {
    const { value: confirmacion } = await Swal.fire({
      title: '¿Estás seguro de borrar al empleado ' + worker.name + '?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Borrar',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacion) {
      return confirmacion;
    }
  }
}
