import { Routes } from '@angular/router';
import { pacienteGuard } from './shared/guards/paciente.guard';
import { adminGuard } from './shared/guards/admin.guard';
import { especialistaGuard } from './shared/guards/especialista.guard';
import { notAuthenticatedGuard } from './shared/guards/not-authenticated.guard';
import { moduleRoutes } from './shared/services/navigation.service';
import { VerificarTokenEmailComponent } from './components/verificar-token-email/verificar-token-email.component';


export const routes: Routes = [
  { path: '', redirectTo: moduleRoutes.AUTH, pathMatch: 'full' },

  { path: moduleRoutes.AUTH, loadChildren: ()=> import ('./pages/auth/auth/auth.module').then(m=>m.AuthModule), canActivate: [notAuthenticatedGuard]},
  { path: moduleRoutes.PACIENTE, loadChildren: ()=> import ('./pages/paciente/paciente/paciente.module').then(m=>m.PacienteModule), canActivate: [pacienteGuard]},
  { path: moduleRoutes.ESPECIALISTA, loadChildren: ()=> import ('./pages/especialista/especialista/especialista.module').then(m=>m.EspecialistaModule), canActivate: [especialistaGuard]},
  { path: moduleRoutes.ADMIN, loadChildren: ()=> import ('./pages/admin/admin/admin.module').then(m=>m.AdminModule), canActivate: [adminGuard]},
  { path: moduleRoutes.VERIFY_EMAIL, component: VerificarTokenEmailComponent},

  { path: '**', redirectTo: moduleRoutes.AUTH }
];
