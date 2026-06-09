export interface parametroRequest {
    page?: number;
    limit?: number;
    idEleccion: number;
    idProceso: number;  
}
export interface candidato {
    idEleccion: number;
    idProceso: number;
    idCandidato: number;
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    area: string;
    localidad: string;
    urlFile: string;
    foto: File;
    estado: number;
    descripcion: string;
    fotoPreview:string | ArrayBuffer | null; // Para almacenar la vista previa de la imagen (URL o base64)
}
export interface candidatoPaginada {
    items: candidato[];
    totalRegistros: number;
    page: number;
    limit: number;
}

