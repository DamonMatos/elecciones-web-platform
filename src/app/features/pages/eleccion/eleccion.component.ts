import { Component,inject, signal,ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';

import { proceso } from './models/proceso.model';
import { Eleccion, EleccionRequest, ProcesoRequest } from './models/eleccion.model';
import { CatalogoRequest, CatalogoResponse } from './models/catalogo.model';

import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { EleccionService } from './service/eleccion.service';
import { CatalogoService } from './service/catalogo.service';

import { toInputDate, toInputColor } from '../../../core/utils/date-color.utils';

import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { EleccionStateService } from './service/eleccion-state.service';

@Component({
  selector: 'app-eleccion',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './eleccion.component.html',
  styleUrl: './eleccion.component.css',
})

export class EleccionComponent {
  private readonly Fornbuilder = inject(FormBuilder);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);
  private eleccionState = inject(EleccionStateService);

  eleccion! : Eleccion;

  _IdEleccion: number = 0;
  _Estado:number = 1;
  _IdCliente:number | null = null;
  _CatalogoEleccion = signal<CatalogoResponse[]>([]);

  

  readonly fb = this.Fornbuilder.group({
    nombre:               ['',[Validators.required]],
    colorBase:            ['', Validators.required],
    logo:                 [null as File | null],
    fechaDifusion:        ['',],
    fechaInicioEleccion:  ['',[Validators.required]],
    fechaFinEleccion:     ['',[Validators.required]],
    plantillaConfirmada : [false],
    procesos:             this.Fornbuilder.array([]),
    estado:               [this._Estado]
  });

  get procesos(): FormArray {
    return this.fb.get('procesos') as FormArray;
  }

  constructor(private authStorageService: AuthStorageService,
              private eleccionService: EleccionService,
              private catalogoService: CatalogoService) {
    this.fb.get('plantillaConfirmada')?.disable();
  }

  private createProceso(): FormGroup {
    return this.Fornbuilder.group({
      idEleccion:          [this._IdEleccion],
      idProceso:           [this.procesos.length + 1],
      nombre:              ['', [Validators.required, Validators.maxLength(100)]],
      numeroCandidato:     [0,  [Validators.required, Validators.min(1)]],
      votacionObligatoria: [true],
      estado:              [0]
    });
  }

  ngOnInit() {
      this.getCatalogo();
  }

  getCatalogo(): void {
      const _idTipo = 1;
      this._IdCliente = this.authStorageService.getCliente();
      const request: CatalogoRequest = {
        tipo: _idTipo,
        id: this._IdCliente!
      };

      this.catalogoService.getById(request).subscribe({
        next: (response) => {
          this._CatalogoEleccion.set(response);
        },
        error: (error) => {
          console.error('Error al obtener el catálogo de elecciones:', error);
        }
    });
  }

  onProcesoChange(event: Event): void { 
    const selectElement = event.target as HTMLSelectElement;
    this._IdEleccion = parseInt(selectElement.value);

    if(this._IdEleccion === 0 || isNaN(this._IdEleccion)){
      this.limpiarFormulario();
      return;
    }

    const request: EleccionRequest = {
      idCliente: this._IdCliente!,
      idEleccion: this._IdEleccion
    };

    this.eleccionService.getById(request).subscribe({
        next: (response) => {
          this._Estado = response.eleccion.estado;
          this.fb.patchValue({
              nombre:              response.eleccion.nombre,
              colorBase:           toInputColor(response.eleccion.colorBase),
              fechaDifusion:       toInputDate(response.eleccion.fechaDifusion),
              fechaInicioEleccion: toInputDate(response.eleccion.fechaInicio),
              fechaFinEleccion:    toInputDate(response.eleccion.fechaFin),
              plantillaConfirmada: response.eleccion.planilla,
              logo:                null,
              estado:              this._Estado
            });

          this.cargarProcesos(response.procesos);

        },
        error: (error) => {
          console.error('Error al obtener el catálogo de procesos:', error);
        }
    });
  }

  private cargarProcesos(procesos: proceso[]): void {
    const procesosArray = this.fb.get('procesos') as FormArray;
    procesosArray.clear();
    this.cdr.detectChanges();

    procesos.forEach(p => {
      procesosArray.push(this.Fornbuilder.group({
        idEleccion:          [p.idEleccion],
        idProceso:           [p.idProceso],
        nombre:              [p.nombre],
        numeroCandidato:     [p.numeroCandidato],
        votacionObligatoria: [p.votacionObligatoria],
        estado:              [p.estado]
      }));
    });

    this.cdr.detectChanges();
  }

  private limpiarFormulario(): void {
    this._IdEleccion = 0;
    this._Estado = 0;

    this.fb.patchValue({
      nombre:              '',
      colorBase:           '#000000',
      fechaDifusion:       '',
      fechaInicioEleccion: '',
      fechaFinEleccion:    '',
      plantillaConfirmada: false,
      logo:                null,
      estado:              this._Estado
    });

    const procesosArray = this.fb.get('procesos') as FormArray;
    procesosArray.clear();
    this.cdr.detectChanges();
  }

  iseleccionInvalid(field: string): boolean {
    const ctrl = this.fb.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  isProcesoInvalid(index: number, field: string): boolean {
    const ctrl = this.procesos.at(index).get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  onFileChangeEleccion(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    this.fb.patchValue({
      logo: file
    });
    this.fb.get('logo')?.updateValueAndValidity();
  }

  agregarProceso(): void {
    this.procesos.push(this.createProceso());
  }

  eliminarProceso(index: number, valor:any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el proceso. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          if(valor.value.estado !== 0){
              const request : ProcesoRequest = {
                idEleccion: valor.value.idEleccion,
                idProceso: valor.value.idProceso
              };

              this.eleccionService.deleteProceso(request).subscribe({
                next: (response) => {
                    console.log('Proceso eliminado:', response);
                    this.procesos.removeAt(index); 
                    this.cdr.detectChanges();
                    Swal.fire('Eliminado', response.message || 'El proceso ha sido eliminado.', 'success');                  
                },
                error: (error) => {           
                  Swal.fire('Error','Error al eliminar el proceso.', 'error'); 
                }
            });
          }
          else{       
            console.log('Proceso eliminado:', valor.value);
            this.procesos.removeAt(index);  
            this.cdr.detectChanges();
            Swal.fire('Eliminado','El proceso ha sido eliminado.', 'success');
          }        
        }
    });
  }

  onSubmit() {
    if (this.fb.invalid) {
      this.fb.markAllAsTouched();
      return;
    }

    const listaProcesos: proceso[] = this.procesos.controls.map(ctrl => ({
        idEleccion:          this._IdEleccion,
        idProceso:           ctrl.value.idProceso,
        nombre:              ctrl.value.nombre,
        numeroCandidato:     ctrl.value.numeroCandidato,
        votacionObligatoria: ctrl.value.votacionObligatoria,
        estado:              ctrl.value.estado
      }));

    const request: Eleccion = {
        idEleccion: this._IdEleccion,
        idCliente: this.authStorageService.getCliente() || 0,
        nombre: this.fb.value.nombre!,
        colorBase: this.fb.value.colorBase!,
        imagenLogo: this.fb.value.logo!,
        fechaDifusion: this.fb.value.fechaDifusion!,
        fechaInicio: this.fb.value.fechaInicioEleccion!,
        fechaFin: this.fb.value.fechaFinEleccion!,
        planilla: false,//this.fb.value.plantillaConfirmada!,
        difusion: false,
        estado: this._Estado,
        procesos  : listaProcesos
      };
    

    this.eleccionService.add(request).subscribe({
      next: (response) => {
          this._IdEleccion = response.data?.ideleccion || 0;
          //this._Estado = 2;
          Swal.fire({
            title: "Registro exitoso",
            text: response.message || "La elección se ha registrado correctamente.",
            icon: "success",
            draggable: true
          });
          this.getCatalogo();
        },
      error: (error) => {
          console.error('Error al guardar la elección:', error);
          Swal.fire({
            title: "Error",
            text: "Ocurrió un error al guardar la elección. Por favor, intenta nuevamente.",
            icon: "error",
            draggable: true
          });
        }
    });
  }

  iniciarDifusion(): void {
    Swal.fire({
      title: '¿Iniciar Difusión?', 
      text: '¿Deseas iniciar la difusión de esta elección?',
      icon: 'question',
      showCancelButton: true, 
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, iniciar',
      cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí puedes agregar la lógica para iniciar la difusión, por ejemplo, llamando a un servicio
          Swal.fire('Difusión Iniciada', 'La difusión de la elección ha sido iniciada.', 'success');
        }
    });
  }

  verconfiguracion(request: any): void {
    this.eleccionState.setIds(
      request.value.idEleccion,
      request.value.idProceso
    );

    this.router.navigate(['configuracion/candidato', request.value.idProceso]);
  }
}