import { Component } from '@angular/core';
import { EmailVerifierService } from '../../shared/services/email-verifier.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter, from, take } from 'rxjs';
import { ClinicaUsuariosService } from '../../shared/services/clinica-usuarios.service';
import { UserService } from '../../shared/services/user.service';
import { NavigationService } from '../../shared/services/navigation.service';

@Component({
  selector: 'app-verificar-token-email',
  templateUrl: './verificar-token-email.component.html',
  styleUrl: './verificar-token-email.component.scss',
  standalone: true,
  imports: [CommonModule]
})
export class VerificarTokenEmailComponent {

  verificado: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private emailVerifierService: EmailVerifierService,
    private userService: UserService,
    private clinicaUsuariosService: ClinicaUsuariosService,
    private navigationService: NavigationService,
  ) {
  }

  ngOnInit()  {
    this.route.queryParams.pipe(
      take(1),
    ).subscribe((params) => {
      const token = params['token'];
      if (token) {
        from(this.emailVerifierService.verificarToken(token)).pipe(
          take(1),
        ).subscribe((result)=>{
          this.verificado = result;
          this.userService.observeCurrentUser().pipe(
            filter((usuario)=>usuario !== null),
            take(1),
          ).subscribe((usuario)=>{
            this.clinicaUsuariosService.setVerificacionDeEmail(usuario.id, true);
            this.navigationService.navigateHome();
          });
        }
        )
      }
    });
  }
}
