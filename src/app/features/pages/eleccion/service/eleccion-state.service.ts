import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class EleccionStateService {
    readonly idEleccion = signal<number>(0);
    readonly idProceso = signal<number>(0);
    readonly validardifusion = signal<boolean>(false);

    setIds(idEleccion: number, idProceso: number): void {
        this.idEleccion.set(idEleccion);
        this.idProceso.set(idProceso);
    }

    setValidarDifusion(validar: boolean): void {
        this.validardifusion.set(validar);
    }

    clear(): void {
        this.idEleccion.set(0);
        this.idProceso.set(0);
        this.validardifusion.set(false);
    }
}