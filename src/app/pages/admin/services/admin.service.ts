import { inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { UserService } from '../../../shared/services/user.service';
import { ClinicaUsuariosService } from '../../../shared/services/clinica-usuarios.service';

@Injectable()
export class AdminService {

  public firestore: Firestore = inject(Firestore);
  public userService: UserService = inject(UserService);
  public clinicaService: ClinicaUsuariosService = inject(ClinicaUsuariosService);

  constructor() { }

  public usuarios$ = this.clinicaService.usuarios$;
  setAprobacionDeUsuario = this.clinicaService.setAprobacionDeUsuario;
}
