import { Injectable,  } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { Eleccion, EleccionRequest, EleccionResponse, ProcesoRequest } from '../models/eleccion.model';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/common/api-response.model';
import { normalizeQueryParams } from '../../../../core/utils/query-params.helper';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class EleccionService extends ApiService{
    protected override apiSection = 'elecciones' as const;
    protected override recurso = 'elecciones' as const;

    getById(request: EleccionRequest): Observable<EleccionResponse> {
      const params = normalizeQueryParams(request);   
        return this.get<ApiResponse<EleccionResponse>>('getById',params)
        .pipe(
          map((response: ApiResponse<EleccionResponse>) => response.data!)
      ); 
    }

    deleteProceso(request : ProcesoRequest): Observable<any> {
      const params = new HttpParams()
      .set('IdEleccion', request.idEleccion.toString())
      .set('IdProceso', request.idProceso.toString());

      return this.delete<any>(`delete?${params.toString()}`)
      .pipe(
        map((response: ApiResponse<any>) => response.data!)
      );
    }

    add(request: Eleccion): Observable<any> 
    {
        const formData = new FormData();
        formData.append('IdEleccion',   request.idEleccion.toString());
        formData.append('IdCliente',  request.idCliente.toString());
        formData.append('Nombre',      request.nombre ?? '');
        formData.append('ColorBase', request.colorBase ?? '');
        formData.append('FechaInicio', request.fechaInicio ?? '');
        formData.append('FechaFin', request.fechaFin ?? '');
        formData.append('PlanillaConfirmada', request.planilla.toString() ?? '0');
        formData.append('DifusionEnviada', request.difusionEnviada.toString() ?? '0');
        formData.append('Estado', (request.estado ?? 0).toString());
        formData.append('Procesos', JSON.stringify(request.procesos ?? [])); 
  
        if (request.imagenLogo) {
          formData.append('Logo', request.imagenLogo, request.imagenLogo.name);
        }
        
        if (request.fechaDifusion) {
          formData.append('FechaDifusion', request.fechaDifusion);
        }

      return this.post<FormData, ApiResponse<any>>(formData)
        .pipe(
          map((response: ApiResponse<any>) => response.data!)
      ); 
    }


    //Generar Difusion
    // difusion(idEleccion: number): Observable<any> 
    // {
    //   //const params = normalizeQueryParams({ IdEleccion:idEleccion });  
    //   return this.post<any, ApiResponse<any>>({ IdEleccion: idEleccion }, 'generarDifusion')
    //     .pipe(
    //       map((response: ApiResponse<any>) => response.data!)
    //   ); 
    // } 


    difusion(idEleccion: number): Observable<any> 
    {
      const params = new HttpParams()
      .set('IdEleccion', idEleccion.toString());

      return this.post<any, ApiResponse<any>>({}, `generarDifusion?${params.toString()}`)
      .pipe(
        map((response: ApiResponse<any>) => response.data!)
      );

      // const params = normalizeQueryParams({ IdEleccion: idEleccion });
      // // 2. Enviamos el post. Si tu método base post permite pasar el body nulo/vacío 
      // // y los params al final (o concatenados en la URL de 'generarDifusion')
      // return this.post<any, ApiResponse<any>>({}, `generarDifusion?${params}`)
      //   .pipe(
      //     map((response: ApiResponse<any>) => response.data!)
      //   ); 
    }
}
