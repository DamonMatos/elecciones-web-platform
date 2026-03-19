import { MenuResponse } from "./menu.model";

export interface UsuarioRequest{
    correo:string;
    clave:string;
    perfil:'Administrador' | 'Empresa';
}

export interface UsuarioResponse {
    idUsuario:number;
    idPersonal:number;
    apePatPer:string;
    apeMatPer:string;
    nomPer:string;
    tipDocPer:string;
    numDocPer:string;
    fehNacPer:string;
    fotPer:string;
    idPerfil:number;
    perfil:string;
    correo:string;
    estado:number;
    token:string;
    
}

export interface UsuarioMenuResponse {
    token:string;   
    expiry:string;
    user:UsuarioResponse;
    menu:MenuResponse[];
}
