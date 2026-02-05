import { Component , inject} from '@angular/core';
import { FormBuilder, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { LoginService } from './service/login.service';
import { LoginModel } from './models/login.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  constructor(private loginService: LoginService, private router: Router) {}
  //private readonly loginService = inject(LoginService);
  private readonly FormBuilder = inject(FormBuilder);

  public _Login!: LoginModel;


  readonly fb = this.FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.fb.valid) {
      this._Login = this.fb.getRawValue() as LoginModel;
      this.router.navigate(['/admin/dashboard']);

        this.loginService.Ingresar(this._Login).subscribe({
          next: (response) => {
              if(response && response.data){
                this.router.navigate(['/registro']);
              }

            console.log('Login successful:', response); 
          },
          error: (error) => {
            console.error('Login failed:', error); 
          },
          complete: () => {
            console.log('Login request completed'); 
          }      
      });
    }
  }

  recuperar(): void {
    alert('Funcionalidad de recuperar contraseña no implementada aún.');
  }

}
