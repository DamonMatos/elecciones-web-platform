import { candidato } from "./candidato.model";
import { proceso } from "./proceso.model";

export interface Eleccion {
    ideleccion: number;
    idcliente:number;
    nombre: string;
    color: string;
    imagenLogo:File;
    fechaDifusion: string |null;
    fechaInicio: string;
    fechaFin: string;
    plantilla: boolean;
    difusion:boolean;
    procesos?: proceso[];
    candidatos?: candidato[];
}