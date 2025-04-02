import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { ResumenComponent } from './vistasAdmin/resumen/resumen.component';
import { EmpleadosComponent } from './vistasAdmin/empleados/empleados.component';
import { InformesComponent } from './vistasAdmin/informes/informes.component';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ResumenComponent, EmpleadosComponent, InformesComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',})
export class AdminComponent {
  // Lista de empleados
  workers: any[] = [];
  vistaActual: string = 'resumenDiario'; 

  constructor(private userService: UserService) {
    this.loadWorkers();
  }

  async loadWorkers() {
    try {
      const response = await this.userService.getAllWorkers();
      this.workers = response.users;
      console.log('Lista de empleados:', this.workers); 
    } catch (error) {
      console.error('Error loading workers:', error);
    }
  }

  cambiarVista(nuevaVista: string) {
    console.log('Vista nueva:', nuevaVista);
    this.vistaActual = nuevaVista;
  }
}
