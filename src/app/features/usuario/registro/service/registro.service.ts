import { Injectable } from '@angular/core';
import { LoginRequest } from '../../login/models/login.model';
import { ApiService } from '../../../../core/services/api.service';
import { ApiResponse } from '../../../../core/models/common/api-response.model';
import { UsuarioMenuResponse, UsuarioRequest, UsuarioResponse } from '../models/usuario.model';
import { map, Observable } from 'rxjs';
import { ClienteResponse } from '../../../pages/perfil/models/cliente.model';
import { PerfilRequest } from '../../../pages/perfil/models/perfil.model';

@Injectable({
  providedIn: 'root',
})
export class RegistroService extends ApiService {

  protected override apiSection = 'elecciones' as const;
  protected override recurso = 'user' as const;

  save(request: UsuarioRequest): Observable<UsuarioMenuResponse>
  {
    return this.post<UsuarioRequest,ApiResponse<UsuarioMenuResponse>>
    (request,'register').pipe(
                map((response:ApiResponse<UsuarioMenuResponse>)=>{
                  return response.data!;
      })
    );
  }

  update(request: PerfilRequest): Observable<any> 
  {
      const formData = new FormData();
      formData.append('IdUsuario',   request.idUsuario.toString());
      formData.append('IdPersonal',  request.idPersonal.toString());
      formData.append('Nombre',      request.nombre ?? '');
      formData.append('ApellidoPaterno', request.apellidoPaterno ?? '');
      formData.append('ApellidoMaterno', request.apellidoMaterno ?? '');
      formData.append('FechaNacimiento', request.fechaNacimiento ?? '');
      formData.append('TipoDocumento', request.tipoDocumento ?? '');
      formData.append('NumeroDocumento', request.numeroDocumento ?? '');
      formData.append('Nombrefoto', request.nombrefoto ?? '');
      formData.append('NombreCliente', request.nombreCliente ?? '');
      formData.append('RazonSocial', request.razonSocial ?? '');
      formData.append('Ruc',         request.ruc         ?? '');

      if (request.foto) {
        formData.append('Foto', request.foto, request.foto.name);
      }

    return this.put<FormData, ApiResponse<any>>(formData, 'update')
    .pipe(
      map((response: ApiResponse<any>) => response.data!)
    );

  }
  
}
