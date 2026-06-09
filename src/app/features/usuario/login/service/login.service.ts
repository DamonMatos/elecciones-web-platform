import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../../core/services/api.service';
import { LoginRequest} from '../models/login.model';
import { ApiResponse } from '../../../../core/models/common/api-response.model';
import { UsuarioMenuResponse, UsuarioRequest, UsuarioResponse } from '../../registro/models/usuario.model';

@Injectable({
  providedIn: 'root',
})

export class LoginService extends ApiService{
  protected override apiSection = 'elecciones' as const;
  protected override recurso = 'auth' as const;

  login(_req: LoginRequest): Observable<UsuarioMenuResponse>
  {
      return this.post<LoginRequest,ApiResponse<UsuarioMenuResponse>>
      (_req,'login')
            .pipe(
                map((response:ApiResponse<UsuarioMenuResponse>)=>{
                  return response.data!;
        })
      );
  }

  save(request: UsuarioRequest): Observable<UsuarioMenuResponse>
  {
    return this.post<UsuarioRequest,ApiResponse<UsuarioMenuResponse>>
    (request,'register').pipe(
                map((response:ApiResponse<UsuarioMenuResponse>)=>{
                  return response.data!;
      })
    );
  }

  send(_req:string | null):void{
    console.log("se envio por correo");

  }





}
