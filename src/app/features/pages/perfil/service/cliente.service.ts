import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { ClienteResponse } from '../models/cliente.model';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/common/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService extends ApiService{
    protected override apiSection = 'elecciones' as const;
    protected override recurso = 'cliente' as const;

  // ── GET /api/v1/cliente/1 ────────────────────────────────────────────────────
  getById(id: number): Observable<ClienteResponse> {
    return this.get<ApiResponse<ClienteResponse>>(`${id}`)
      .pipe(
        map((response: ApiResponse<ClienteResponse>) => response.data!)
      );
  }

}
