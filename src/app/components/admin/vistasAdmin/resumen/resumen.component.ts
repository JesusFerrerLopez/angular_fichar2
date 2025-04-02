import { Component, Input, OnChanges, SimpleChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-resumen',
  imports: [ CommonModule ],
  templateUrl: './resumen.component.html',
  styleUrls: ['./resumen.component.css', '../estilos.css']
})
export class ResumenComponent {
  @Input() workers: any[] = []; // Lista de empleados
  legibleWorkers: any[] = []; // Lista de empleados legible

  ngOnChanges(changes: SimpleChanges) {
    if (changes['workers'] && this.workers.length > 0) {
      this.filterWorkers();
    }
  }
 
  // ************* NECESARIO CAMBIAR QUE SOLO SE MUESTREN LOS QUE HAN FICHADO HOY ******************
  filterWorkers() {
    // const today = new Date();
    this.legibleWorkers = this.workers.filter(worker => {
      if (!worker.last_action) return false;

      const lastActionDate = new Date(worker.last_action);
      
      // return lastActionDate.getFullYear() === today.getFullYear() &&
      //        lastActionDate.getMonth() === today.getMonth() &&
      //        lastActionDate.getDate() === today.getDate();
      return true;
    });
  }
}
