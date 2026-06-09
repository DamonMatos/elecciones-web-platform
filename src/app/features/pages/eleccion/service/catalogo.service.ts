import { Injectable } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { CatalogoRequest,CatalogoResponse } from '../models/catalogo.model';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../../../../core/models/common/api-response.model';
import { normalizeQueryParams } from '../../../../core/utils/query-params.helper'; 

@Injectable({
  providedIn: 'root',
})
export class CatalogoService extends ApiService {
    protected override apiSection = 'elecciones' as const;
    protected override recurso = 'catalogo' as const;
    
    // ── GET /api/v1/catalogo/1 ────────────────────────────────────────────────────
    getById(request: CatalogoRequest): Observable<CatalogoResponse[]> {
      const params = normalizeQueryParams(request);   
      return this.get<ApiResponse<CatalogoResponse[]>>('',params)
        .pipe(
          map((response: ApiResponse<CatalogoResponse[]>) => response.data || [])
        );
    }

  
}
