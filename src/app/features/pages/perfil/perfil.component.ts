import { Component, inject } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,Validators } from '@angular/forms';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { ClienteService } from './service/cliente.service';
import { ClienteResponse } from './models/cliente.model';
import { PerfilRequest } from './models/perfil.model';
import { RegistroService } from '../../usuario/registro/service/registro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent{
  private readonly Formbuilder = inject(FormBuilder);

  perfilrequest! : PerfilRequest;
  clienteresponse! : ClienteResponse;
  preview: string | ArrayBuffer | null = null;

  idUsuario  : number = 0;
  idPersonal : number = 0;

  readonly fb = this.Formbuilder.group({
    nombre : [''],
    apellidoPaterno : [''],
    apellidoMaterno : [''],
    fechaNacimiento : [''],
    tipoDocumento : [''],
    numeroDocumento : [''],
    nombreCliente : [''],
    razonSocial : [''],
    ruc : [''],
    foto : [null as File | null]
  });

  constructor(private authStorageService: AuthStorageService, 
              private clienteService: ClienteService, 
              private registroService: RegistroService) {
            }

  ngOnInit(){
    this.getUser();    
  }

  getUser(){
    const _usuario  = this.authStorageService.getUser();
    this.idUsuario  = _usuario?.idUsuario || 0;
    this.idPersonal = _usuario?.idPersonal || 0;

    if(_usuario){
        this.fb.patchValue({
          nombre: _usuario.nomPer == "Nuevo Usuario" ? '' : _usuario.nomPer,
          apellidoPaterno: _usuario.apePatPer,
          apellidoMaterno: _usuario.apeMatPer,
          fechaNacimiento: this.convertirFecha(_usuario.fehNacPer),
          tipoDocumento: _usuario.tipDocPer,
          numeroDocumento: _usuario.numDocPer
      });
      this.getCliente(_usuario.idPersonal);

    }
  }

  getCliente(idPersonal: number){
    if(idPersonal){
      this.clienteService.getById(idPersonal).subscribe({
        next: (cliente) => {
            this.clienteresponse = cliente;
            this.fb.patchValue({
              nombreCliente: this.clienteresponse.nombreCliente,
              razonSocial: this.clienteresponse.razonSocial,
              ruc: this.clienteresponse.ruc.trim(),
            });
            
            this.authStorageService.saveCliente(cliente.idCliente);
        },
        error: (error) => {
          Swal.fire({
              title: "Error de Proceso",
              text: error.error.message || "Ocurrió un error al cargar el perfil",
              icon: "error",
              draggable: true
            });
      }
      });
    }   
  }

  convertirFecha(fecha: string): string {
    const [dia, mes, resto] = fecha.split('/');
    const anio = resto.split(' ')[0];
    return `${anio}-${mes}-${dia}`;
  }

  onFileChange(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    this.fb.patchValue({
      foto: file
    });
    this.fb.get('foto')?.updateValueAndValidity();
  }

  onSubmit(): void{
    const _perfil = this.fb.getRawValue();
    this.perfilrequest = {
      idUsuario: this.idUsuario,
      idPersonal: this.idPersonal,
      nombre: _perfil.nombre,
      apellidoPaterno: _perfil.apellidoPaterno,
      apellidoMaterno: _perfil.apellidoMaterno,
      fechaNacimiento: _perfil.fechaNacimiento,
      tipoDocumento: _perfil.tipoDocumento,
      numeroDocumento: _perfil.numeroDocumento,
      nombrefoto: _perfil.numeroDocumento?.trim() + '.png',
      nombreCliente: _perfil.nombreCliente,
      razonSocial: _perfil.razonSocial,
      ruc: _perfil.ruc,
      foto: _perfil.foto
    };

    this.registroService.update(this.perfilrequest).subscribe({
      next: (response) => {
        if(response){
          Swal.fire({
            title: "Registro exitoso",
            text: response.mensaje,
            icon: "success",
            draggable: true
          });       
        }
      },
      error: (error) => {
          Swal.fire({
              title: "Error de Proceso",
              text: error.error.message || "Ocurrió un error al actualizar el perfil",
              icon: "error",
              draggable: true
            });
      }
    });
  }
}
