export interface candidato {
    ideleccion: number;
    idproceso: number;
    idcandidato: number;
    tipoDocumento: string;
    numeroDocumento: string;
    nombre: string;
    area: string;
    localidad: string;
    foto: string;
    imagenFoto: File;
    estado: number;
    descripcion: string;
}