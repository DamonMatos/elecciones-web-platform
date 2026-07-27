import { Component, inject, signal,ChangeDetectorRef,computed } from '@angular/core';
import { VotanteServiceTs } from './service/votante.service.ts';
import { AuthStorageService } from 'src/app/core/services/auth-storage.service';
import { candidatos, elector, procesos, VotanteResponse } from './models/votante.js';

@Component({
  selector: 'app-votante',
  imports: [],
  templateUrl: './votante.component.html',
  styleUrl: './votante.component.css',
})
export class VotanteComponent {
  private readonly cdr = inject(ChangeDetectorRef);
  
  constructor(private authStorageService: AuthStorageService, private votanteService: VotanteServiceTs) { 
  }

  procesos = signal<procesos[]>([]);
  private todosCandidatos = signal<candidatos[]>([]);
  private idProcesoSeleccionado = signal<number>(0);

  public electores = signal<elector[]>([]);
  public elector = signal<elector | null>(null);
  candidatosSeleccionados = signal<number[]>([]);


  candidatos = computed<candidatos[]>(() => {
      const idProceso = this.idProcesoSeleccionado();
      if (!idProceso) return [];

      return this.todosCandidatos().filter(
        (c) => c.idProceso === idProceso
      );
    });
  
  esVotoValido = computed(() => {
    const total = this.candidatosSeleccionados().length;
    return total >= 2 && total <= 6;
  });

  conmutarSeleccion(idCandidato: number): void {
    const seleccionados = this.candidatosSeleccionados();
    
    if (seleccionados.includes(idCandidato)) {
      // Si ya estaba seleccionado, lo removemos
      this.candidatosSeleccionados.set(seleccionados.filter(id => id !== idCandidato));
    } else {
      // Si no estaba y ya llegó al máximo de 6, no permitimos agregar más
      if (seleccionados.length >= 6) {
        alert('Solo puedes seleccionar un máximo de 6 candidatos.');
        return;
      }
      // Lo agregamos a la lista
      this.candidatosSeleccionados.set([...seleccionados, idCandidato]);
    }
  }

  ngOnInit() {
    this.getVotante();
  }

  getVotante() {
    const _usuario  = this.authStorageService.getUser();
    const idUsuario = _usuario?.idUsuario; 

    if (idUsuario) {
      this.votanteService.getById(idUsuario).subscribe(
        (votante) => {
          this.procesos.set(votante.procesos);
          this.todosCandidatos.set(votante.candidatos);
        },
        (error) => {
          console.error('Error al obtener el votante:', error);
        }
      );
    }
  }

  onProcesoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const idProceso = parseInt(selectElement.value, 10);
    this.idProcesoSeleccionado.set(isNaN(idProceso) ? 0 : idProceso);
  }

  enviarVotacion() {
    const idProceso = this.idProcesoSeleccionado(); 
  }

  toggleCandidatoSeleccionado(idCandidato: number): void {
    const seleccionados = this.candidatosSeleccionados(); 
  }


}
