import { Component,inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { proceso } from './models/proceso.model';
import { Eleccion } from './models/eleccion.model';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { candidato } from './models/candidato.model';

@Component({
  selector: 'app-eleccion',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './eleccion.component.html',
  styleUrl: './eleccion.component.css',
})
export class EleccionComponent {
  private readonly Fornbuilder = inject(FormBuilder);
  eleccion! : Eleccion;

  readonly fb = this.Fornbuilder.group({
    nombre: ['',[Validators.required]],
    colorbase: ['#000000', Validators.required],
    logo: [null as File | null],
    fechadifusion: ['',[Validators.required]],
    fechainicioeleccion: ['',[Validators.required]],
    fechafineleccion: ['',[Validators.required]],
    plantillaconfirmada: [false],
    procesos: this.Fornbuilder.array([]),
    candidatos: this.Fornbuilder.array([]),
  });

  candidatoForm: FormGroup = this.Fornbuilder.group({
    ideleccion: [0],
    idproceso: [0],
    idcandidato: [0],
    tipoDocumento: ['', Validators.required],
    numeroDocumento: ['', Validators.required],
    nombre: ['', Validators.required],
    area: ['', Validators.required],
    localidad: ['', Validators.required],
    imagenFoto: [null as File | null],
    descripcion: ['', Validators.required],
    fotoPreview: [''] 
  });

  editIndex: number | null = null;

  get procesos(): FormArray {
    return this.fb.get('procesos') as FormArray;
  }

  get candidatos(): FormArray {
    return this.fb.get('candidatos') as FormArray;
  }

  constructor(private authStorageService: AuthStorageService) {}

  private createProceso(): FormGroup {
    return this.Fornbuilder.group({
      ideleccion:          [0],
      idproceso:           [0],
      nombreProceso:       ['', [Validators.required, Validators.maxLength(100)]],
      numeroCandidatos:    [0,  [Validators.required, Validators.min(1)]],
      votacionObligatoria: [false],
      estado:              [1]
    });
  }

  private createCandidato(): FormGroup {
    return this.Fornbuilder.group({
      ideleccion:          [0],
      idproceso:           [0],
      idcandidato:         [0], 
      tipoDocumento:       ['', [Validators.required]],
      numeroDocumento:    ['',  [Validators.required]],
      nombre: ['', [Validators.required]],
      area: ['', [Validators.required]],
      localidad: ['', [Validators.required]],
      imagenFoto: [null as File | null],
      descripcion: ['', [Validators.required]],
      fotoPreview:['']
    });
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

  eliminarProceso(index: number): void {
    this.procesos.removeAt(index);
  }


 //<------------------CANDIDATOS------------------->
  agregarCandidato(): void {
    this.editIndex = null;
    this.candidatoForm = this.createCandidato();
  }

  editarCandidato(index: number): void {
    const candidato = this.candidatos.at(index).value;

    this.editIndex = index;
    this.candidatoForm.patchValue({
      tipoDocumento: candidato.tipoDocumento,
      numeroDocumento: candidato.numeroDocumento,
      nombre:candidato.nombre,
      area:candidato.area,
      localidad:candidato.localidad,
      imagenFoto:candidato.imagenFoto,
      descripcion:candidato.descripcion,
      fotoPreview: candidato.fotoPreview || 'assets/images/users/user-default.jpg'
    });
  }

  eliminarCandidato(index: number): void {
    this.candidatos.removeAt(index);
  }

  onFileChangeCandidato(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.candidatoForm.patchValue({
        imagenFoto: file,
        fotoPreview: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  guardarCandidato(): void {
    if (this.candidatoForm.invalid) {
      this.candidatoForm.markAllAsTouched();
      return;
    }

    const candidatoData = this.candidatoForm.value;
    if (this.editIndex !== null) {
      this.candidatos.at(this.editIndex).patchValue(candidatoData);
    } 
    else {
      this.candidatos.push(this.createCandidato());
      this.candidatos.at(this.candidatos.length - 1).patchValue(candidatoData);
    }

    const modal = document.getElementById('candidatoModal');
    const instance = (window as any).bootstrap.Modal.getInstance(modal);
    instance?.hide();

  }



  agregarColaborador(): void {
    // Lógica para agregar un colaborador
  }

  eliminarColaborador(index: number): void {
    // Lógica para eliminar un colaborador
  }

  onSubmit() {

  if (this.fb.invalid) {
    this.fb.markAllAsTouched();
    return;
  }

  const listaProcesos: proceso[] = this.procesos.controls.map(ctrl => ({
      ideleccion:          0,
      idproceso:           ctrl.value.idproceso,
      nombreProceso:       ctrl.value.nombreProceso,
      numeroCandidatos:    ctrl.value.numeroCandidatos,
      votacionObligatoria: ctrl.value.votacionObligatoria,
      estado:              1
    }));

  const ListaCandidatos: candidato[] = this.candidatos.controls.map(ctrl => ({
      ideleccion:          0,
      idproceso:           ctrl.value.idproceso || 0,
      idcandidato:         ctrl.value.idcandidato || 0,
      tipoDocumento: ctrl.value.tipoDocumento!,
      numeroDocumento: ctrl.value.numeroDocumento!,
      nombre: ctrl.value.nombre!,
      area: ctrl.value.area!,
      localidad: ctrl.value.localidad!,
      foto: ctrl.value.numeroDocumento! + ".jpg",
      imagenFoto: ctrl.value.imagenFoto!,
      estado: 1,
      descripcion: ctrl.value.descripcion!
    }));

  const request: Eleccion = {
      ideleccion: 0,
      idcliente: this.authStorageService.getCliente() || 0,
      nombre: this.fb.value.nombre!,
      color: this.fb.value.colorbase!,
      imagenLogo: this.fb.value.logo!,
      fechaDifusion: this.fb.value.fechadifusion!,
      fechaInicio: this.fb.value.fechainicioeleccion!,
      fechaFin: this.fb.value.fechafineleccion!,
      plantilla: false,//this.fb.value.plantillaconfirmada!,
      difusion: false,
      procesos: listaProcesos,
      candidatos: ListaCandidatos
    };

    console.log(request);

  }



}