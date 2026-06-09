import { Injectable } from '@angular/core';
import { ApiResponse } from 'src/app/core/models/common/api-response.model';
import { PaginatedResponse } from 'src/app/core/models/common/paginated-response.model';
import { ApiService } from 'src/app/core/services/api.service';
import { candidato, parametroRequest,  } from '../models/candidato.model';
import { map,Observable } from 'rxjs';
import { normalizeQueryParams } from 'src/app/core/utils/query-params.helper';

@Injectable({
  providedIn: 'root',
})
export class CandidatoService extends ApiService {
    protected override apiSection = 'elecciones' as const;
    protected override recurso = 'candidato' as const;

  getCandidatos(request: parametroRequest): Observable<PaginatedResponse<candidato>> {
    const params = normalizeQueryParams(request);  
    return this.get<ApiResponse<PaginatedResponse<candidato>>>(params)
        .pipe(map(res => res.data!));    
    
  }

  Delete(request: candidato): Observable<any> {
    const _Accion = 3; // Acción para eliminar
    const formdata = new FormData();
      formdata.append('Accion', _Accion.toString());
      formdata.append('IdEleccion', request.idEleccion.toString());
      formdata.append('IdProceso', request.idProceso.toString()); 
      formdata.append('IdCandidato', request.idCandidato.toString());
      formdata.append('TipoDocumento', request.tipoDocumento ?? '');
      formdata.append('NumeroDocumento', request.numeroDocumento ?? '');
    return this.post<FormData, ApiResponse<any>>(formdata)
      .pipe(map(res => res.data!));
  }

  Update(request:candidato): Observable<any> {
    const _Accion = 2; // Acción para actualizar
    const formdata = new FormData();
      formdata.append('Accion', _Accion.toString());
        formdata.append('IdEleccion', request.idEleccion.toString());
        formdata.append('IdProceso', request.idProceso.toString());
        formdata.append('IdCandidato', request.idCandidato.toString());
        formdata.append('TipoDocumento', request.tipoDocumento ?? '');
        formdata.append('NumeroDocumento', request.numeroDocumento ?? '');
        formdata.append('NombreCompleto', request.nombreCompleto ?? '');
        formdata.append('Area', request.area ?? '');
        formdata.append('Localidad', request.localidad ?? '');
        formdata.append('Estado', (request.estado ?? 0).toString());
        formdata.append('Descripcion', request.descripcion ?? '');
        formdata.append('UrlFile', request.urlFile ?? '');
        if (request.foto) {
          formdata.append('Foto', request.foto, request.foto.name);
        } 
    return this.post<FormData, ApiResponse<any>>(formdata)
      .pipe(map(res => res.data!));
  }

  Add(request: candidato): Observable<any> {
    const _Accion = 1; // Acción para agregar
    const formdata = new FormData();
      formdata.append('Accion', _Accion.toString());
        formdata.append('IdEleccion', request.idEleccion.toString());
        formdata.append('IdProceso', request.idProceso.toString()); 
        formdata.append('IdCandidato', request.idCandidato.toString());
        formdata.append('TipoDocumento', request.tipoDocumento ?? '');
        formdata.append('NumeroDocumento', request.numeroDocumento ?? '');
        formdata.append('NombreCompleto', request.nombreCompleto ?? '');
        formdata.append('Area', request.area ?? '');
        formdata.append('Localidad', request.localidad ?? '');
        formdata.append('Estado', (request.estado ?? 0).toString());
        formdata.append('Descripcion', request.descripcion ?? '');
        formdata.append('UrlFile', request.urlFile ?? '');
      
    if (request.foto) {
      formdata.append('Foto', request.foto, request.foto.name);
    } 
      
    return this.post<FormData, ApiResponse<any>>(formdata)
      .pipe(map(res => res.data!));
  }

}
