import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/core/services/api.service';
import { VotanteResponse } from '../models/votante';
import { ApiResponse } from 'src/app/core/models/common/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class VotanteServiceTs extends ApiService {
    protected override apiSection = 'elecciones' as const;
    protected override recurso = 'votante' as const;

    getById(idUsuario: number): Observable<VotanteResponse> {
        return this.get<ApiResponse<VotanteResponse>>(`${idUsuario}`)
          .pipe(
            map((response: ApiResponse<VotanteResponse>) => response.data!)
          );
    } 
}
