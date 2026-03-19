import { Component, inject, Injectable } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroService } from '../registro/service/registro.service'

import Swal from 'sweetalert2'
import { UsuarioRequest } from './models/usuario.model';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  private readonly Formbuilder = inject(FormBuilder);

  usuario! : UsuarioRequest;
  errors: string[] = [];

  readonly fb = this.Formbuilder.group({
    correo : ['', [Validators.required, Validators.email]],
    clave : ['', Validators.required],
    confirmarclave : ['', Validators.required],
    perfil : ['Empresa']
  });

  constructor(private router: Router, private registroService: RegistroService) {}

  save(): void{
    this.errors = [];
    // if(!this.fb.valid){
    //   return;
    // }
    
    this.usuario = this.fb.getRawValue() as UsuarioRequest;
    
      const _contrasena = this.fb.value.clave;
      const _repetircontrasena = this.fb.value.confirmarclave;
      if(_contrasena === _repetircontrasena){       
        this.registroService.save(this.usuario).subscribe({
          next:(response)=> {
            if(response){
                Swal.fire({
                    title: "Registro exitoso",
                    text: "El usuario ha sido registrado correctamente.",
                    icon: "success",
                    draggable: true
                  });

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
      else{
        this.errors.push("las contraseñas no cohenciden");
      }
  }


  goBack(): void {
    this.router.navigate(['/login']);
  }

}
