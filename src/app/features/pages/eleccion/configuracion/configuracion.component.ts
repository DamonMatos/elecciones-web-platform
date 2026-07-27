import { Component,inject,signal,ChangeDetectorRef } from '@angular/core';
import { FormBuilder,FormGroup,Validators,ReactiveFormsModule,FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EleccionStateService } from '../service/eleccion-state.service';
import { CandidatoService } from '../service/candidato.service';
import { PaginatedResponse } from 'src/app/core/models/common/paginated-response.model';
import { candidato, parametroRequest,  } from '../models/candidato.model';
import { ColaboradorService } from '../service/colaborador.service';

import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { BehaviorSubject } from 'rxjs';
import { colaborador, colaboradorRequest } from '../models/colaborador.model';

@Component({
  selector: 'app-configuracion',
  imports: [ReactiveFormsModule],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css',
})
export class ConfiguracionComponent {
  private route = inject(ActivatedRoute);
  private readonly FormBuilder = inject(FormBuilder);
  private eleccionState = inject(EleccionStateService);
  private readonly cdr = inject(ChangeDetectorRef);

  idProceso!: number;
  idEleccion!: number;
  editIndex: number | null = null;
  habilitarNumeroDocumento = true;

  tipo = 1; // 1: Candidatos, 2: Colaboradores

  paginacionActual: Pick<PaginatedResponse<candidato>, 'page' | 'limit'> = { page: 1, limit: 10 };
  totalRegistros = 0;
  totalPaginas = 0;

  errorCarga?: string;

  listaCandidatos: candidato[] = [];
  listaColaboradores: colaborador[] = [];
  listaColaboradorestemporal : colaborador[] = [];
  colaboradormany!: colaboradorRequest;

  _ArchivoFoto: File | null = null;
  _FotoPreview = signal<string>('assets/images/users/user-default.jpg');
  _validardifusion = false;
  fotoPreview: string | null = null;

  readonly fbcandidatos = this.FormBuilder.group({
    idEleccion:                 [0],
    idProceso:                  [0],
    idCandidato:                [0],
    tipoDocumento:              ['0',[Validators.required]],
    numeroDocumento:            ['', Validators.required],
    nombreCompleto:             ['', Validators.required],
    area:                       ['', Validators.required],
    localidad:                  ['', Validators.required],
    foto:                       [null as File | null],
    fotoPreview:                ['assets/images/users/user-default.jpg'],
    descripcion:                ['', Validators.required],
    estado:                     [1]
  });

  constructor(private candidatoService: CandidatoService,
              private colaboradorService: ColaboradorService) {
  }

  ngOnInit(): void {
    this.idProceso = Number(this.route.snapshot.paramMap.get('idProceso'));
    this.idEleccion = this.eleccionState.idEleccion();
    this._validardifusion = (this.eleccionState.validardifusion());
    this.getCandidatos();
    this.getColaboradores();
  }

  private obtenerFiltrosConsulta(): parametroRequest {
    return {
        page: this.paginacionActual.page,
        limit: this.paginacionActual.limit,
        idEleccion: this.idEleccion,
        idProceso: this.idProceso
    };
  }

  getCandidatos(): void{
    this.listaCandidatos = [];
    this.candidatoService.getCandidatos(this.obtenerFiltrosConsulta()).subscribe({
        next: (response) => {
          this.listaCandidatos = response.items;         
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorCarga = err instanceof Error ? err.message : 'No se encontró resultados para la búsqueda.';
        }
    });
  }

  onFileChangeCandidato(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    this.fbcandidatos.get('foto')?.setValue(file);
    this.fbcandidatos.get('foto')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.fotoPreview = reader.result as string;
      this.cdr.detectChanges(); 
    };
    reader.readAsDataURL(file);
  }

  parametroCandidato(): candidato {
    const candidatoData : candidato = {
      idEleccion: this.idEleccion,
      idProceso: this.idProceso,
      idCandidato: this.fbcandidatos.value.idCandidato!,
      tipoDocumento: this.fbcandidatos.value.tipoDocumento!,
      numeroDocumento: this.fbcandidatos.value.numeroDocumento!,
      nombreCompleto: this.fbcandidatos.value.nombreCompleto!,
      area: this.fbcandidatos.value.area!,
      localidad: this.fbcandidatos.value.localidad!,
      urlFile: this.fbcandidatos.value.numeroDocumento + ".jpg",
      foto: this.fbcandidatos.value.foto!,
      descripcion: this.fbcandidatos.value.descripcion!,
      estado: this.fbcandidatos.value.estado!,
      fotoPreview : this.fbcandidatos.value.fotoPreview!
    };  
    return candidatoData;
  }

  nuevoCandidato(){
    this.fbcandidatos.reset();
    this.fbcandidatos.patchValue({
      idEleccion: this.idEleccion,
      idProceso: this.idProceso,
      idCandidato: 0,
      tipoDocumento: '0',
      estado: 1
    });
    this.tipo = 1;
  }

  agregarCandidato() {
    if (this.fbcandidatos.invalid) return;

    const candidatoData = this.parametroCandidato();

    if(this.tipo === 2){
      this.candidatoService.Update(candidatoData).subscribe({
        next: (response) => {
          Swal.fire({
            title: "Candidato actualizado",
            text: response.message || "El candidato ha sido actualizado correctamente.",
            icon: "success",
            draggable: true
          });       
          this.getCandidatos();
        },
        error: (err) => {
          Swal.fire({
            title: "Error al actualizar candidato",
            text: err instanceof Error ? err.message : "Ocurrió un error al actualizar el candidato.",
            icon: "error",
            draggable: true
          });
        }
      });
    }
    else{
        this.candidatoService.Add(candidatoData).subscribe({
          next: (response) => {
            Swal.fire({
              title: "Candidato agregado",
              text: response.message || "El candidato ha sido agregado correctamente.",
              icon: "success",
              draggable: true
            });       
            this.getCandidatos();
          },
          error: (err) => {
            Swal.fire({
              title: "Error al agregar candidato",
              text: err instanceof Error ? err.message : "Ocurrió un error al agregar el candidato.",
              icon: "error",
              draggable: true
            });
          }
      });
    }
  }

  eliminarCandidato(index: number): void {
    const candidato = this.listaCandidatos[index];
    Swal.fire({
      title: "¿Eliminar candidato?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      draggable: true
      }).then((result) => {
          if (result.isConfirmed) {
            this.candidatoService.Delete(candidato).subscribe({
              next: (response) => {
                Swal.fire({
                  title: "Candidato eliminado",
                  text: "El candidato ha sido eliminado de la lista.",
                  icon: "success",
                  draggable: true
                });
                this.getCandidatos();
              },
              error: (err) => {
                Swal.fire({
                  title: "Error al eliminar candidato",
                  text: err instanceof Error ? err.message : "Ocurrió un error al eliminar el candidato.",
                  icon: "error",
                  draggable: true
              });
            }
        }); 
      }         
    });
  }

  editarCandidato(index: number): void {
    const candidato = this.listaCandidatos[index];
    this.tipo = 2;
    this.habilitarNumeroDocumento = false;

    this.fbcandidatos.patchValue({
      idEleccion      : candidato.idEleccion,
      idProceso       : candidato.idProceso,
      idCandidato     : candidato.idCandidato,
      tipoDocumento   : candidato.tipoDocumento,
      numeroDocumento : candidato.numeroDocumento,
      nombreCompleto  : candidato.nombreCompleto,
      area            : candidato.area,
      localidad       : candidato.localidad,
      foto            : candidato.foto,
      descripcion     : candidato.descripcion,
      estado          : candidato.estado
    });
      this.fotoPreview = candidato.fotoPreview as string;
  }

  isInvalid(field: string): boolean {
    const control = this.fbcandidatos.get(field);
    return !!control && control.invalid && control.touched;
  }


  //********************Colaboradores***********************************//
  getColaboradores(): void {
    this.colaboradorService.getColaboradores(this.obtenerFiltrosConsulta()).subscribe({
      next: (response) => {
          this.listaColaboradores = response.items;
          this.totalRegistros = response.totalRegistros;
          this.paginacionActual = { page: response.page, limit: response.limit };
          this.totalPaginas = response.limit > 0 ? Math.ceil(response.totalRegistros / response.limit) : 1;
          this.cdr.detectChanges();
      },
      error: (err) => {
          this.totalRegistros = 0;
          this.totalPaginas = 0;
          this.errorCarga = err instanceof Error ? err.message : 'No se encontró resultados para la búsqueda.';
      }
    });
  }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas || nuevaPagina === this.paginacionActual.page) {
      return;
    }
    this.paginacionActual.page = nuevaPagina;
    this.getColaboradores();
  }

  cargarExcel(files: FileList | null): void {
    if (!files || files.length === 0) return;

    const file   = files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string          = e.target.result;
      const wb: XLSX.WorkBook     = XLSX.read(bstr, { type: 'binary' });
      const wsname: string        = wb.SheetNames[0];
      const ws: XLSX.WorkSheet    = wb.Sheets[wsname];
      const dataRaw               = XLSX.utils.sheet_to_json(ws, { defval: '' }) as any[];

      if (dataRaw.length === 0) {
          Swal.fire({
                  title: "Error",
                  text: "El archivo Excel está vacío.",
                  icon: "error",
                  draggable: true
                });
        return;
      }

      dataRaw.forEach(row => {
        const colaborador : colaborador = {
          idEleccion: this.idEleccion,
          idProceso: this.idProceso,
          tipoDocumento:     String(row['tipoDocumento']    || ''),
          numeroDocumento:   String(row['numeroDocumento']  || ''),
          cargo:             String(row['cargo']            || ''),
          sede:              String(row['sede']             || ''),
          nombre:            String(row['nombre']           || ''),
          apellidoPaterno:   String(row['apellidoPaterno']  || ''),
          apellidoMaterno:   String(row['apellidoMaterno']  || ''),
          emailDifusion:     String(row['correo']           || ''),
          estado: 1
        };

      this.listaColaboradorestemporal.push(colaborador);
      this.cdr.detectChanges();
      });    
    };
    
    reader.readAsBinaryString(file);
  }

  eliminarColaborador(i: number): void {
    this.listaColaboradorestemporal.splice(i, 1);
    this.cdr.detectChanges();
  }

  guardarColaboradores(): void {
    this.colaboradormany = { colaboradores: this.listaColaboradorestemporal };
    this.colaboradorService.createMany(this.colaboradormany).subscribe({
      next: (response) => {
        Swal.fire({
          title: "Colaboradores guardados",
          text: response.length > 0 ? `${response.length} colaboradores han sido guardados correctamente.` : "No se guardaron colaboradores.",
          icon: "success",
          draggable: true
        });
        this.listaColaboradorestemporal = [];
        this.getColaboradores();
      },
      error: (err) => {
        Swal.fire({
          title: "Error al guardar colaboradores",
          text: err instanceof Error ? err.message : "Ocurrió un error al guardar los colaboradores.",
          icon: "error",
          draggable: true
        });
      }
    });
  }

  cancelarCargaColaboradores(): void {
    this.listaColaboradorestemporal = [];
    this.cdr.detectChanges();
  }
  
}
