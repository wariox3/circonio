import { inject, Injectable } from '@angular/core';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';

@Injectable({
  providedIn: 'root',
})
export class MovimientoService {
  private httpBase = inject(HttpBaseRepository);

  constructor() {}

  movimientos(socio_id: number) {
    return this.httpBase.post(`contenedor/movimiento/consulta-socio/`, {
      socio_id,
    });
  }
}
