import { Component, OnInit } from '@angular/core';
import { LoginModel } from '../../features/usuario/login/models/login.model';
import { RouterLink } from "@angular/router";


@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styles: [],
  imports: [RouterLink]
})
export class SidebarComponent implements OnInit {
  public _Cantidad :number = 0;
  public _ListMenu : any;
  public _ListSubMenu : any;
  _UsuarioModel!: LoginModel;

  public _NombreUsuario:String="";
  public _Foto : String = "";
  
  constructor() { 
  }

  ngOnInit(): void {
      const _menu = localStorage.getItem('Menu');
      const _submenu = localStorage.getItem('SubMenu');
      const _usuario = localStorage.getItem('Usuario');
      if (_usuario) {
        this._UsuarioModel = JSON.parse(_usuario);
        // this._NombreUsuario = this._UsuarioModel.nomPer + ' ' +this._UsuarioModel.apePatPer;
        // this._Foto = this._UsuarioModel.fotoBase64;
      if (_menu) {
        this._ListMenu = JSON.parse(_menu);
        if (_submenu) {
          this._ListSubMenu = JSON.parse(_submenu);
        }
      }
    }
  }
  

  getSubMenu(idMenu: number) {
    const __ListSubMenu = this._ListSubMenu.filter((sub: { idMenu: number }) => sub.idMenu === idMenu);
    return __ListSubMenu;
  }
  

}
