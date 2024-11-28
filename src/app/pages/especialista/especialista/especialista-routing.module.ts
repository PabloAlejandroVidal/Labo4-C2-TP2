import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EspecialistaLayoutComponent } from '../especialista-layout/especialista-layout.component';
import { EspecialistaTurnosComponent } from '../especialista-turnos/especialista-turnos.component';
import { emailVerificadoGuard } from '../../../shared/guards/email-verificado.guard';
import { moduleRoutes } from '../../../shared/services/navigation.service';
import { UnverifiedEmailComponent } from '../../../components/unverified-email/unverified-email.component';
import { MiPerfilComponent } from '../mi-perfil/mi-perfil.component';
import { MisHorariosComponent } from '../mis-horarios/mis-horarios.component';

const routes: Routes = [
  { path: '', component: EspecialistaLayoutComponent,
    children: [
      { path: '', redirectTo: 'turnos', pathMatch: 'full'},
      { path: 'turnos', component: EspecialistaTurnosComponent, canActivate: [emailVerificadoGuard] },
      { path: 'mi-perfil', component: MiPerfilComponent, canActivate: [emailVerificadoGuard] },
      { path: 'mis-horarios', component: MisHorariosComponent, canActivate: [emailVerificadoGuard] },
      { path: moduleRoutes.UNVERIFIED_EMAIL, component: UnverifiedEmailComponent }
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EspecialistaRoutingModule { }
