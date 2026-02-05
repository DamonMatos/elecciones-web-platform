import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { map, Observable } from 'rxjs';
import { LoginModel } from '../models/login.model';
import { MenuModel } from '../models/menu.model';
import { ApiResponse } from '../../../../core/models/common/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService extends ApiService{
  protected override apiSection = 'elecciones' as const;
  protected override recurso = 'documento' as const;

  public Ingresar(_request: LoginModel):Observable<any>
  {
    console.log(_request);
    return this.post<LoginModel,ApiResponse<MenuModel>>(_request,'ingresar');
    //     .pipe(
    //       map((response:ApiResponse<MenuModel>)=>{
    //           return response.data;
    // }));
  }



}
