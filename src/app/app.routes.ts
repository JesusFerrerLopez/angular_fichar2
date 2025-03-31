import { Routes } from '@angular/router';
import { JornadaComponent } from './components/jornada/jornada.component';
import { InformesComponent } from './components/informes/informes.component';
import { ResumenesComponent } from './components/resumenes/resumenes.component';
import { LoginComponent } from './components/login/login.component';

export const routes: Routes = [
    { path: '', component: JornadaComponent },
    { path: 'informes', component: InformesComponent },
    { path: 'informes/resumen', component: ResumenesComponent },
    { path: 'login', component: LoginComponent}
];
