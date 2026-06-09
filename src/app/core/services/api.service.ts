import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

type ApiSection = keyof typeof environment.api;

@Injectable({ providedIn: 'root' })
export abstract class ApiService {

    protected readonly http = inject(HttpClient);

    protected apiSection!: ApiSection;
    protected recurso!: string;

    protected get baseUrl(): string {
        const config = environment.api[this.apiSection];
        return `${config.baseUrl}/${config.version}`;
    }

    protected get endpoint(): string {
        return `${this.baseUrl}/${this.recurso}`;
    }
    
    get<TResponse>(): Observable<TResponse>;
    get<TResponse>(params: Record<string, any>): Observable<TResponse>;
    get<TResponse>(path: string): Observable<TResponse>;
    get<TResponse>(path: string, params: Record<string, any>): Observable<TResponse>;
    get<TResponse>(path: string, params: Record<string, any>, isBlob: boolean): Observable<Blob>;
    get<TResponse>(arg1?: string | Record<string, any>, arg2?: Record<string, any>, arg3?: boolean): Observable<TResponse | Blob> {
        let url = this.endpoint;
        let params: Record<string, any> | undefined;
        let isBlob = arg3|| false;
        if (typeof arg1 === 'string') {
            url += `/${arg1}`;
            params = arg2;
        } else {
            params = arg1;
        }
        const httpParams = new HttpParams({ fromObject: params || {} });
        if (isBlob) {
            return this.http.get(url, { params: httpParams, responseType: 'blob' });
        } else {
            return this.http.get<TResponse>(url, { params: httpParams });
        }
    }

    post<TRequest, TResponse>(body: TRequest, path?: string): Observable<TResponse> {
        const url = path ? `${this.endpoint}/${path}` : this.endpoint;
        return this.http.post<TResponse>(url, body);
    }

    put<TRequest, TResponse>(body: TRequest, path: string | number): Observable<TResponse> {
        const url = `${this.endpoint}/${path}`;
        return this.http.put<TResponse>(url, body);
    }
    
    delete<TResponse>(path: string | number): Observable<TResponse>;
    delete<TRequest, TResponse>(body: TRequest, path?: string| number): Observable<TResponse>;
    delete<TRequest, TResponse>(bodyOrPath: TRequest | string | number, path?: string | number): Observable<TResponse> {
        // Si el primer argumento es string/number sin segundo arg → es path
        if ((typeof bodyOrPath === 'string' || typeof bodyOrPath === 'number') && path === undefined) {
            const url = `${this.endpoint}/${bodyOrPath}`;
            return this.http.delete<TResponse>(url);
        }
        // Si hay body → body + path opcional

        const url = `${this.endpoint}/${path}`;
        return this.http.delete<TResponse>(url,{body: bodyOrPath});
    }

}
