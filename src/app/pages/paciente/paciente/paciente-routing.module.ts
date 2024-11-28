import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PacienteLayoutComponent } from '../paciente-layout/paciente-layout.component';
import { emailVerificadoGuard } from '../../../shared/guards/email-verificado.guard';
import { moduleRoutes } from '../../../shared/services/navigation.service';
import { UnverifiedEmailComponent } from '../../../components/unverified-email/unverified-email.component';
import { PacienteTurnosComponent } from '../paciente-turnos/paciente-turnos.component';
import { PacienteMisTurnosComponent } from '../paciente-mis-turnos/paciente-mis-turnos.component';

const routes: Routes = [
  { path: '', component: PacienteLayoutComponent,
    children: [
      { path: '', redirectTo: 'turnos', pathMatch: 'full'},
      { path: 'turnos', component: PacienteTurnosComponent, },
      { path: 'mis-turnos', component: PacienteMisTurnosComponent, },
      { path: moduleRoutes.UNVERIFIED_EMAIL, component: UnverifiedEmailComponent},
      { path: '**', component: PacienteTurnosComponent}
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PacienteRoutingModule { }
