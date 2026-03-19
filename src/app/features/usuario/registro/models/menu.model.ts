export interface MenuResponse{
    idPerfil:number;
    perfil:string;
    idMenu:number;
    menu:string;
    idSubMenu:number;
    nomVista:string;
    nomUrl:string;
    icono:string;
    tipo:string;
    cantidad:number;
}

// Estructura jerárquica para el sidebar
export interface SubMenuItem {
    idSubMenu: number;
    nomVista:  string;
    nomUrl:    string;
    icono:     string;
}

export interface MenuItem {
    idMenu:    number;
    menu:      string;
    nomUrl:    string;
    icono:     string;
    cantidad:  number;
    subMenus:  SubMenuItem[];
    expanded:  boolean;
}