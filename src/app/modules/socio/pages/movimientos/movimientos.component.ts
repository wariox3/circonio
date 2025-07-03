import { Component, inject, OnInit, signal } from '@angular/core';
import { MovimientoService } from '../../services/movimiento.service';
import { Movimiento } from '../../interfaces/movimiento.interface';
import { CommonModule } from '@angular/common';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { of, switchMap, tap } from 'rxjs';
import { Usuario } from '@app/modules/auth/interfaces/usuario.interface';

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movimientos.component.html',
})
export default class MovimientosComponent implements OnInit {
  private _movimientoService = inject(MovimientoService);
  private store = inject(Store);
  public arrMovimientos = signal<Movimiento[]>([]);

  ngOnInit() {
    this.store
      .select(selectCurrentUser)
      .pipe(
        switchMap((usuario: Usuario) => {
          if (usuario && usuario.es_socio) {
            return this._movimientoService.movimientos(usuario.socio_id);
          }
          return of({ movimientos: [] });
        }),
        tap((respuesta: any) => {
          if (respuesta.movimientos) {
            this.arrMovimientos.set(respuesta.movimientos);
          }
        })
      )
      .subscribe();
  }
}
