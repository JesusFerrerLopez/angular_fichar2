import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-informes',
  imports: [],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent {
  @Input() workers: any[] = []; // Lista de empleados

}
