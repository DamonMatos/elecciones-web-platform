import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthStorageService } from '../../core/services/auth-storage.service';
@Component({
  selector: 'app-header',
  standalone: true, 
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {
  public _Nombre : String = "";
  public _Correo : String = "";
  public _Perfil : String = "";
  public _FotoPer : String = "";
  
  isCollapsed  = signal(false);
  isSearchOpen = signal(false);

  constructor(private router: Router, private authStorageService:AuthStorageService) {

  }
  
  toggle() {
    this.isCollapsed.update(v => !v);
  }

  toggleSidebar() {
    this.toggle();
  }

  ngOnInit(): void {
    const _token = this.authStorageService.getToken();
    if(_token){
      const _usuario = this.authStorageService.getUser();
      if(_usuario){
        this._Nombre = _usuario.nomPer + ' ' + _usuario.apePatPer + ' ' + _usuario.apeMatPer; 
        this._Correo = _usuario.correo;
        this._Perfil = _usuario.perfil;
        this._FotoPer = _usuario.fotPer || 'assets/images/users/user-default.jpg';
      }
    } 
  }
  
  cerrarSesion(): void {
    this.router.navigate(['/login']);
    this.authStorageService.clearSession();
  }

  miperfil(): void {
    this.router.navigate(['/perfil']);
  }

}
