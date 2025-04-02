import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workers'] && this.workers.length > 0) {
      this.filterWorkers();
    }
  }

  filterWorkers() {
    const { filteredWorkers, notFilteredWorkers } = this.getFilteredWorkers();
    this.filteredWorkers = filteredWorkers;
    this.notFilteredWorkers = notFilteredWorkers;
    console.log('Filtered Workers:', this.filteredWorkers);
    console.log('Not Filtered Workers:', this.notFilteredWorkers);
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
}
