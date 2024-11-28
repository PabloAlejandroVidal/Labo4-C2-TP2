import { Component } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { first } from 'rxjs';
import { Especialista } from '../../../shared/services/clinica-usuarios.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent {
  defaultImage = 'assets/user-image.png';

  public especialista!: Especialista;
  constructor(
    private userService: UserService,

  ) {

  }
  ngOnInit(): void {
    this.userService.observeCurrentUser().pipe(
      first(),
    ).subscribe((usuario)=>{
      this.especialista = usuario as Especialista;
    })
  }
}
