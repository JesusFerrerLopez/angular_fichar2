import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { InformesComponent } from './components/informes/informes.component';
import { ResumenesComponent } from './components/resumenes/resumenes.component';
import { LoginComponent } from './components/login/login.component';
import { AdminComponent } from './components/admin/admin.component';
import { adminGuard } from './services/guards/admin.guard';
import { InformesAdminComponent } from './components/admin/informes-admin/informes-admin.component';


export const routes: Routes = [
    { path: '', component: InicioComponent },
    { path: 'informes', component: InformesComponent },
    { path: 'informes/resumen', component: ResumenesComponent },
    { path: 'login', component: LoginComponent },

    // Rutas de administración
    { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
    { path: 'admin/informes', component: InformesAdminComponent, canActivate: [adminGuard] },
];
