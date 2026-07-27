export interface colaborador {
    idEleccion: number;
    idProceso:number;
    tipoDocumento: string;
    numeroDocumento: string;
    cargo: string;
    sede: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;    
    emailDifusion: string;
    //idUsuario: number;  
    estado:number;
}

export interface colaboradorRequest {
    colaboradores: colaborador[];
}

export interface colaboradorPaginada {
    items: colaborador[];
    totalRegistros: number;
    page: number;
    limit: number;
}