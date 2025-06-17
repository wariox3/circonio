import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ContenedorRepository } from '../../repositories/contenedor.repository';
import { Store } from '@ngrx/store';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { NgIf } from '@angular/common';
import { Contenedor } from '../../interfaces/contenedor.interface';

@Component({
  selector: 'app-contenedor',
  standalone: true,
  imports: [NgIf],
  templateUrl: './contenedor.component.html',
  styleUrl: './contenedor.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContenedorComponent implements OnInit {
  private contenedorRepository = inject(ContenedorRepository);
  private store = inject(Store);
  private usuarioId: string;

  public contenedores = signal<Contenedor[]>([]);

  ngOnInit() {
    this.store.select(selectCurrentUser).subscribe(usuario => {
      this.usuarioId = usuario.id;
    });

    this.contenedorRepository.getMisContenedores(this.usuarioId, true).subscribe(contenedores => {
      this.contenedores.set(contenedores.contenedores);
    });
  }
}
