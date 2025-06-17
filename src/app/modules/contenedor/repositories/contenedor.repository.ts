import { inject, Injectable } from '@angular/core';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';

@Injectable({
  providedIn: 'root',
})
export class ContenedorRepository {
  private httpBase = inject(HttpBaseRepository);

  getMisContenedores(usuarioId: string, reddoc: boolean) {
    return this.httpBase.post<{ contenedores: any[] }>(
      `contenedor/usuariocontenedor/consulta-usuario/`,
      {
        usuario_id: usuarioId,
        reddoc,
      }
    );
  }
}
