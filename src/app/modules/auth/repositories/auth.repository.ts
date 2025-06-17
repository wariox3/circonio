import { inject, Injectable } from '@angular/core';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';
import { Login } from '../interfaces/login.interface';
import { LoginResponse, UpdateResponse } from '../interfaces/auth.interface';
import { Register, RegisterResponse } from '../interfaces/register.interface';
import { RecoverPasswordResponse } from '../interfaces/recover-password.interface';
import { Usuario } from '../interfaces/usuario.interface';
import { CambiarPassword } from '@app/modules/securidad/interfaces/seguridad.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthRepository {
  private httpBase = inject(HttpBaseRepository);

  login(credenciales: Login) {
    return this.httpBase.post<LoginResponse>('seguridad/login/', {
      username: credenciales.username,
      password: credenciales.password,
      cf_turnstile_response: credenciales.cfTurnstileResponse,
      proyecto: credenciales.proyecto,
    });
  }

  register(usuario: Register) {
    return this.httpBase.post<RegisterResponse>('seguridad/usuario/', usuario);
  }

  recoverPassword(email: string) {
    return this.httpBase.post<RecoverPasswordResponse>(
      'seguridad/usuario/cambio-clave-solicitar/',
      {
        username: email,
        accion: 'clave',
      }
    );
  }

  updatePerfil(perfil: Partial<Usuario>) {
    return this.httpBase.put<UpdateResponse>(`seguridad/usuario/${perfil.id}/`, {
      nombre: perfil.nombre,
      apellido: perfil.apellido,
      nombre_corto: perfil.nombre_corto,
      telefono: perfil.telefono,
      idioma: perfil.idioma,
      cargo: perfil.cargo,
      numero_identificacion: perfil.numero_identificacion,
    });
  }

  updateImagenPerfil(usuario_id: string, base64: string) {
    return this.httpBase.post<{
      cargar: boolean;
      imagen: string;
    }>(`seguridad/usuario/cargar-imagen/`, {
      usuario_id,
      imagenB64: base64,
    });
  }

  eliminarImagenPerfil(usuario_id: string) {
    return this.httpBase.post<{
      limpiar: boolean;
      imagen: string;
    }>(`seguridad/usuario/limpiar-imagen/`, {
      usuario_id,
    });
  }

  cambiarPassword(cambiarPassword: CambiarPassword) {
    return this.httpBase.post<UpdateResponse>(`seguridad/usuario/cambio-clave/`, {
      usuario_id: cambiarPassword.usuarioId,
      password: cambiarPassword.password,
    });
  }
}
