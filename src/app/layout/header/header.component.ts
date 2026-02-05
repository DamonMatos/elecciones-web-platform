import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
//import { UsuarioModel } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-header',
  standalone: true, 
  imports: [ReactiveFormsModule],
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {
  //private fb: FormBuilder = new FormBuilder();
  public _Nombre : String = "";
  public _Correo : String = "";
  public _Perfil : String = "";
  public imagenBase64 : String = "";
  //_UsuarioModel: UsuarioModel = new UsuarioModel("");
  
  isCollapsed  = signal(false);
  isSearchOpen = signal(false);

  // searchForm = this.fb.nonNullable.group({
  //   term: ['']
  // });

  constructor(private router: Router) {
    
  }

//   //Funciones para el buscador
//   toggleSearch(): void {
//   this.isSearchOpen.update(v => !v);
// }


//   closeSearch(): void {
//     this.isSearchOpen.set(false);
//     this.searchForm.reset();
//   }

//   onSearch(): void {
//     // const term = this.searchForm.value.term.trim();

//     // if (!term) return;

//     this.closeSearch();
//   }


  //Mostrar u ocultar el sidebar 
  toggle() {
    this.isCollapsed.update(v => !v);
  }
  toggleSidebar() {
    this.toggle();
  }

  ngOnInit(): void {
  //  const _Token = localStorage.getItem('Token');

  //  const datos = localStorage.getItem('Usuario');
  //   if (datos) {
  //     this._UsuarioModel = JSON.parse(datos);
  //     this._Nombre = this._UsuarioModel.nomPer + ' ' + this._UsuarioModel.apePatPer + ' ' + this._UsuarioModel.apeMatPer; 
  //     this._Correo = this._UsuarioModel.correo;
  //     this._Perfil = this._UsuarioModel.perfil;
  //     this.imagenBase64 = this._UsuarioModel.fotoBase64;

  //   }    
  }
  
  cerrarSesion(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('Menu');
    localStorage.removeItem('SubMenu');    
    localStorage.removeItem('Usuario');
    this.router.navigate(['/login']);
  }

}
