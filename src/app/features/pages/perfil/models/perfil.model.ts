
export interface PerfilRequest {
    idUsuario: number;
    idPersonal: number;
    nombre: string | null;
    apellidoPaterno: string | null;
    apellidoMaterno: string | null;
    fechaNacimiento: string | null;
    tipoDocumento: string | null;
    numeroDocumento: string | null;
    nombrefoto:string | null;
    nombreCliente: string| null;
    razonSocial: string| null;
    ruc: string | null;
    foto: File | null;

}
