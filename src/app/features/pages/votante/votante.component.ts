import { Component, inject, signal, ChangeDetectorRef, computed } from '@angular/core';
import { VotanteServiceTs } from './service/votante.service.ts';
import { AuthStorageService } from 'src/app/core/services/auth-storage.service';
import { candidatos, elector, procesos, VotanteResponse } from './models/votante.js';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-votante',
  imports: [],
  templateUrl: './votante.component.html',
  styleUrl: './votante.component.css',
})
export class VotanteComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(
    private authStorageService: AuthStorageService,
    private votanteService: VotanteServiceTs,
  ) {}

  public procesos = signal<procesos[]>([]);
  private todosCandidatos = signal<candidatos[]>([]);
  private idProcesoSeleccionado = signal<number>(0);

  public electores = signal<elector[]>([]);
  public elector = signal<elector | null>(null);
  public candidatosSeleccionados = signal<number[]>([]);

  candidatos = computed<candidatos[]>(() => {
    const idProceso = this.idProcesoSeleccionado();
    if (!idProceso) return [];

    return this.todosCandidatos().filter((c) => c.idProceso === idProceso);
  });

  ngOnInit() {
    this.getVotante();
  }

  getVotante() {
    const _usuario = this.authStorageService.getUser();
    const idUsuario = _usuario?.idUsuario;

    if (idUsuario) {
      this.votanteService.getById(idUsuario).subscribe(
        (votante) => {
          this.procesos.set(votante.procesos);
          this.todosCandidatos.set(votante.candidatos);
        },
        (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Error al obtener el votante',
              text: 'No se pudo obtener la información del votante. Por favor, inténtelo de nuevo más tarde.',
            }); 
        },
      );
    }
  }

  esVotoValido = computed(() => {
    const total = this.candidatosSeleccionados().length;
    return total>= 2 && total <= 6;
  });

  conmutarSeleccion(idCandidato: number): void {
    const seleccionados = this.candidatosSeleccionados();

    if (seleccionados.includes(idCandidato)) {
      this.candidatosSeleccionados.set(seleccionados.filter((id) => id !== idCandidato));
    } else {
      if (seleccionados.length >= 6) {
        Swal.fire({
          icon: 'warning',
          title: 'Límite de selección alcanzado',
          text: 'Solo puedes seleccionar hasta 6 candidatos.',
        });          
        return;
      }
      this.candidatosSeleccionados.set([idCandidato]);
    }
  }

  onProcesoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const idProceso = parseInt(selectElement.value, 10);
    this.idProcesoSeleccionado.set(isNaN(idProceso) ? 0 : idProceso);
  }

  // toggleCandidatoSeleccionado(idCandidato: number): void {
  //   const seleccionados = this.candidatosSeleccionados();
  // }

  // obtenerObjetoCandidatosIds() {
  //   const seleccionados = this.candidatosSeleccionados();

  //   return seleccionados.reduce((acc, candidato, index) => {
  //     acc[`candidato${index + 1}`] = candidato; 
  //     return acc;
  //   }, {} as Record<string, number>);
  // }


  enviarVotacion() {
    const idProceso = this.idProcesoSeleccionado();

    // const payloadVotacion = {
    //   ...this.obtenerObjetoCandidatosIds()
    // };

    //console.log('Objeto listo para enviar:', payloadVotacion);
  }

}
