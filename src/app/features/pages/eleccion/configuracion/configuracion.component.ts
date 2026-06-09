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
import { colaborador } from '../models/colaborador.model';

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


  _ArchivoFoto: File | null = null;
  _FotoPreview = signal<string>('assets/images/users/user-default.jpg');
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
          console.log('Candidatos obtenidos:', this.listaCandidatos);        
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
    this.tipo = 1; 
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
  getColaboradores(): void{
    this.colaboradorService.getColaboradores(this.obtenerFiltrosConsulta()).subscribe({
      next: (response) => {
          this.totalRegistros = response.totalRegistros;
          this.paginacionActual = { page: response.page, limit: response.limit };
          this.totalPaginas = response.limit > 0 ? Math.ceil(response.totalRegistros / response.limit) : 1;
         // this.colaboradores.clear();

          if (response.items && Array.isArray(response.items)) {
            response.items.forEach((colaborador: any) => {
              // this.colaboradores.push(this.createColaborador(colaborador));
            });
            this.cdr.detectChanges();
          }
      },
      error: (err) => {
         // this.colaboradores.clear();
          this.totalRegistros = 0;
          this.totalPaginas = 0;
          this.errorCarga = err instanceof Error ? err.message : 'No se encontró resultados para la búsqueda.';
      }
    });
  }

  private createColaborador(colaborador: colaborador): FormGroup {
    return this.FormBuilder.group({
      idEleccion:       [colaborador.idEleccion ?? 0],
      idProceso:        [colaborador.idProceso ?? 0],
      tipoDocumento:    [colaborador.tipoDocumento ?? '', Validators.required],
      numeroDocumento:  [colaborador.numeroDocumento ?? '', Validators.required],
      nombre:           [colaborador.nombre ?? '', Validators.required],
      apellidoPaterno:  [colaborador.apellidoPaterno ?? '', Validators.required],
      apellidoMaterno:  [colaborador.apellidoMaterno ?? '', Validators.required],
      emailDifusion:    [colaborador.emailDifusion ?? '', [Validators.required, Validators.email]],
      cargo:            [colaborador.cargo ?? '', Validators.required],
      sede:             [colaborador.sede ?? '', Validators.required]
    });
  }

  // get colaboradores(): FormArray {
  //   return this.mainForm.get('colaboradores') as FormArray;
  // }

  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas || nuevaPagina === this.paginacionActual.page) {
      return;
    }
    this.paginacionActual.page = nuevaPagina;
    this.getColaboradores();
  }

  agregarColaborador(): void {
    const colaborador : colaborador = {
      idEleccion : this.idEleccion,
      idProceso : this.idProceso,
      tipoDocumento: "",
      numeroDocumento: "",
      cargo: "",
      sede: "",
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      emailDifusion: "",
      idUsuario: 0,
      estado: 0

    };
   // this.colaboradores.insert(0, this.createColaborador(colaborador));
    this.cdr.detectChanges();
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

      // dataRaw.forEach(row => {
      //   const grupo = this.createColaborador();
      //   grupo.patchValue({
      //     tipoDocumento:     String(row['tipoDocumento']    || ''),
      //     numeroDocumento:   String(row['numeroDocumento']  || ''),
      //     nombreColaborador: String(row['nombre']           || ''),
      //     apellidoPaterno:   String(row['apellidoPaterno']  || ''),
      //     apellidoMaterno:   String(row['apellidoMaterno']  || ''),
      //     correo:            String(row['correo']           || ''),
      //     cargo:             String(row['cargo']            || ''),
      //     sede:              String(row['sede']             || '')
      //   });

      //this.colaboradores.push(grupo);
      //this.cdr.detectChanges();
      // });

      // Swal.fire({
      //             title: "Registro exitoso",
      //             text: `Se cargaron ${dataRaw.length} colaboradores correctamente.`,
      //             icon: "success",
      //             draggable: true
      //           });

    };

    reader.readAsBinaryString(file);
  }

  eliminarColaborador(i: number): void {
    //this.colaboradores.removeAt(i);
  }

  guardar(): void {
    // Swal.fire({
    //   title: "Guardar Proceso de Elección?",
    //   text: "¿Confirma que desea guardar los cambios realizados en el proceso de elección?",
    //   icon: "question",
    //   showCancelButton: true,
    //   confirmButtonText: "Sí, guardar",
    //   cancelButtonText: "Cancelar",
    //   draggable: true
    //   }).then((result) => {
    //       if (result.isConfirmed) {
    //         // Aquí iría la lógica para enviar los datos al backend, por ejemplo:

    //         Swal.fire({
    //           title: "Proceso de Elección guardado",
    //           text: "Los cambios han sido guardados correctamente.",
    //           icon: "success",
    //           draggable: true
    //         });
    //       }
    //   });

    // if (this.candidatoForm.invalid) {
    //   this.candidatoForm.markAllAsTouched();
    //   return;
    // }

    // const candidatoData = this.candidatoForm.value;
    // if (this.editIndex !== null) {
    //   this.candidatos.at(this.editIndex).patchValue(candidatoData);
    // }
    // else {
    //   this.candidatos.push(this.createCandidato());
    //   this.candidatos.at(this.candidatos.length - 1).patchValue(candidatoData);
    // }

    // const modal = document.getElementById('candidatoModal');
    // const instance = (window as any).bootstrap.Modal.getInstance(modal);
    // instance?.hide();
    //console.log(this.mainForm.value);

  }

    // const ListaCandidatos: candidato[] = this.candidatos.controls.map(ctrl => ({
    //     ideleccion:          0,
    //     idproceso:           ctrl.value.idproceso || 0,
    //     idcandidato:         ctrl.value.idcandidato || 0,
    //     tipoDocumento: ctrl.value.tipoDocumento!,
    //     numeroDocumento: ctrl.value.numeroDocumento!,
    //     nombre: ctrl.value.nombre!,
    //     area: ctrl.value.area!,
    //     localidad: ctrl.value.localidad!,
    //     foto: ctrl.value.numeroDocumento! + ".jpg",
    //     imagenFoto: ctrl.value.imagenFoto!,
    //     estado: 1,
    //     descripcion: ctrl.value.descripcion!
    //   }));
}
