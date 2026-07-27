export interface Votante {
}


export interface VotanteResponse {
    procesos: procesos[],
    candidatos: candidatos[]
}

export interface procesos {
    idEleccion : number,
    nombreEleccion: string,
    idProceso: number,
    nombreProceso: string,
    tipodocumento: string,
    numeroDocumento: string,
    fechaFin: Date,
}

export interface candidatos {
    idEleccion: number,
    idProceso: number,
    idCandidato: number,
    nombreCompleto: string,
    area: string,
    urlFile: string,
    fotoPreview: string,
    votado:boolean
}

export interface elector {
    idEleccion: number,
    idProceso: number,
    idElector: number,
    idCandidato1: number,
    idCandidato2: number,
    idCandidato3: number,
    idCandidato4: number,
    idCandidato5: number,
    idCandidato6: number,
}