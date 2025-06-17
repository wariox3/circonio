import { inject, Injectable } from '@angular/core';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';
import { Contenedor } from '../interfaces/contenedor.interface';

@Injectable({
  providedIn: 'root',
})
export class ContenedorRepository {
  private httpBase = inject(HttpBaseRepository);

  getMisContenedores(usuarioId: string, reddoc: boolean) {
    return this.httpBase.post<{ contenedores: Contenedor[] }>(
      `contenedor/usuariocontenedor/consulta-usuario/`,
      {
        usuario_id: usuarioId,
        reddoc,
      }
    );
  }
}
