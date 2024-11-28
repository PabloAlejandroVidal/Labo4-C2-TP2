import { Component, inject } from '@angular/core';
import { environment } from '../../../enviroments/environment';
import { EmailVerifierService } from '../../shared/services/email-verifier.service';
import { UserService } from '../../shared/services/user.service';
import { Usuario } from '../../shared/services/clinica-usuarios.service';
import { filter, take } from 'rxjs';


@Component({
  selector: 'app-unverified-email',
  templateUrl: './unverified-email.component.html',
  styleUrl: './unverified-email.component.scss'
})
export class UnverifiedEmailComponent {

  user: Usuario | null = null;

  constructor(
    private userService: UserService,
    private emailVerifierService: EmailVerifierService
  ){
  }


  sendConfirmationEmail () {
    const subscription = this.userService.observeCurrentUser().pipe(
      filter((usuario)=>usuario !== null),
      take(1),
    ).subscribe((usuario)=>{
      this.emailVerifierService.enviarCorreoConfirmacion(usuario);
    }
    );
  }
}
