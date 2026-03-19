import { Component, OnInit,signal } from '@angular/core';
import { LoginRequest } from '../../features/usuario/login/models/login.model';
import { RouterLink,Router } from "@angular/router";
import { UsuarioResponse } from '../../features/usuario/registro/models/usuario.model';
import { AuthStorageService } from '../../core/services/auth-storage.service';
import { MenuResponse } from '../../features/usuario/registro/models/menu.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styles: [],
  imports: [RouterLink]
})
export class SidebarComponent implements OnInit {
  public _Cantidad :number = 0;
  public _ListMenu : MenuResponse[] = [];
  public _ListSubMenu : MenuResponse[] = [];
  _UsuarioModel!: UsuarioResponse;

  private _activeMenu  = signal<number | null>(null);
  readonly userExpanded = signal<boolean>(false);

  public _NombreUsuario:String="";
  public _Foto : String = "";
  
  constructor(private authStorageService:AuthStorageService, private router: Router) { 
  }

  ngOnInit(): void {
      const _menu = this.authStorageService.getMenu();
      const _usuario = this.authStorageService.getUser();

      if (_usuario) {
        this._UsuarioModel = _usuario;
        this._NombreUsuario = this._UsuarioModel.nomPer + ' ' +this._UsuarioModel.apePatPer;
        this._Foto = this._UsuarioModel.fotPer || 'assets/images/users/user-default.jpg';
      }

      if (_menu) {
        this._ListMenu = _menu.filter(i => i.tipo === 'Si' && i.idSubMenu === 0);
        this._ListSubMenu = _menu.filter(i => i.idSubMenu !== 0);
      }
  }
  

  getSubMenus(idMenu: number) {
    const __ListSubMenu = this._ListSubMenu.filter((sub: { idMenu: number }) => sub.idMenu === idMenu);
    return __ListSubMenu;
  }
  

  toggle(idMenu: number): void {
    this._activeMenu.update(current =>
      current === idMenu ? null : idMenu
    );
  }

    // ── Toggle usuario ───────────────────────────────────────────────────────────
  toggleUser(): void {
    this.userExpanded.update(v => !v);
  }

  // ── Helpers para el template ─────────────────────────────────────────────────
  isMenuActive(idMenu: number): boolean {
    return this._activeMenu() === idMenu;
  }

  cerrarSesion(): void {
    this.router.navigate(['/login']);
    this.authStorageService.clearSession();
  }

  miperfil(): void {
    this.router.navigate(['/perfil']);
  }

  //[class.in]="userExpanded()"
}
