import { Component , inject} from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LoginService } from './service/login.service';
import { LoginRequest } from './models/login.model';
import Swal from 'sweetalert2'
import { AuthStorageService } from '../../../core/services/auth-storage.service';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {

  constructor(private loginService: LoginService, private router: Router, private authStorageService:AuthStorageService) {}

  private readonly FormBuilder = inject(FormBuilder);
  public _Login!: LoginRequest;

  readonly fb = this.FormBuilder.group({
    correo: ['', Validators.required],
    clave: ['', Validators.required]
  });

  onSubmit(): void {
    if(!this.fb.valid){
      return;
    }

      this._Login = this.fb.getRawValue() as LoginRequest;
      this.loginService.login(this._Login).subscribe({
        next: (response) => {
          if(response){
            this.authStorageService.saveSession(response);
            this.router.navigate(['/perfil']);
          }
        },
        error: (error) => {
            Swal.fire({
                title: "Error de inicio de sesión",
                text: "Credenciales inválidas o usuario no encontrado.",
                icon: "error",
                draggable: true
              });
          }     
    });  
  }

  send(): void {
    const _correo = this.fb.controls.correo.value;
    if(!_correo){
      return;
    }

    this.loginService.send(_correo);

    Swal.fire({
      title: "¿Olvidaste tu contraseña?",
      text: "No te preocupes, hemos enviado un correo con la nueva clave de recuperación",
      icon: "info",
    });

  }

}
