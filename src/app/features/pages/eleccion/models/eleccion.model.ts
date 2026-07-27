import { proceso } from "./proceso.model";
export interface Eleccion {
    idEleccion: number;
    idCliente:number;
    nombre: string;
    colorBase: string;
    imagenLogo:File;
    fechaDifusion?: string |null;
    fechaInicio: string;
    fechaFin: string;
    planilla: boolean;
    difusionEnviada:boolean;
    estado: number;
    procesos?: proceso[];
}

export interface EleccionRequest {
    idCliente:number; 
    idEleccion: number;
}
export interface EleccionResponse {
    eleccion: Eleccion;
    procesos: proceso[];
}


export interface ProcesoRequest{
    idEleccion:number;
    idProceso:number;
}