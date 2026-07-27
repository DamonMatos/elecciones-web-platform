import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';
import { normalizeQueryParams } from 'src/app/core/utils/query-params.helper';
import { parametroRequest } from '../models/candidato.model';
import { map,Observable } from 'rxjs';
import { PaginatedResponse } from 'src/app/core/models/common/paginated-response.model';
import { colaborador, colaboradorRequest } from '../models/colaborador.model';
import { ApiResponse } from 'src/app/core/models/common/api-response.model';

@Injectable({
    providedIn: 'root',
})
export class ColaboradorService extends ApiService {
    protected override apiSection = 'elecciones' as const;
    protected override recurso = 'colaborador' as const;

    getColaboradores(request: parametroRequest): Observable<PaginatedResponse<colaborador>> {
        const params = normalizeQueryParams(request);  
        return this.get<ApiResponse<PaginatedResponse<colaborador>>>(params)
            .pipe(
                map(res => res.data!)
            );    
        
    }

    createMany(colaboradores: colaboradorRequest): Observable<any> {
        console.log('Enviando colaboradores al servicio:', colaboradores);
        return this.post<colaboradorRequest, ApiResponse<colaboradorRequest>>(colaboradores)
            .pipe(
                map(res => res.data!)
            );
    }
}
