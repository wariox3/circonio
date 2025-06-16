import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '@app/core/services/cookie.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthRepository } from '../../repositories/auth.repository';
import { loginFailure, loginRequest, loginSuccess, logout } from '../actions/login.action';
import { LOCALSTORAGE_KEYS } from '@app/core/constants/localstorage-keys.constant';
import { environment } from '@environments/environment';
import { AlertaService } from '@app/common/services/alerta.service';
import {
  updateFailure,
  updateImageFailure,
  updateImageRequest,
  updateImageSuccess,
  updateRequest,
  updateSuccess,
} from '../actions/perfil.action';
import { ModalService } from '@app/common/services/modal.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private cookieService = inject(CookieService);
  private alertaService = inject(AlertaService);
  private authRepository = inject(AuthRepository);
  private modalService = inject(ModalService);
  private router = inject(Router);

  constructor() {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequest),
      switchMap(({ credentials }) =>
        this.authRepository.login(credentials).pipe(
          map(response => {
            const cookieOptions = this.cookieService.getAuthCookieOptions(environment.cookieTime);
            // Guardar la información del usuario en una cookie para rehidratar el estado
            this.cookieService.set(
              LOCALSTORAGE_KEYS.USER,
              JSON.stringify(response.user),
              cookieOptions
            );
            this.cookieService.set(LOCALSTORAGE_KEYS.AUTH_TOKEN, response.token, cookieOptions);
            this.cookieService.set(
              LOCALSTORAGE_KEYS.REFRESH_TOKEN,
              response['refresh-token'],
              cookieOptions
            );

            this.alertaService.mostrarExito('Inicio de sesión exitoso', 'Bienvenido');

            return loginSuccess({ response });
          }),
          catchError(error => of(loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
          this.router.navigate(['/perfil']);
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailure),
        tap(({ error }) => {
          console.error('Error de autenticación:', error);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.cookieService.delete(LOCALSTORAGE_KEYS.USER);
          this.cookieService.delete(LOCALSTORAGE_KEYS.AUTH_TOKEN);
          this.cookieService.delete(LOCALSTORAGE_KEYS.REFRESH_TOKEN);
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );

  updatePerfil$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequest),
      switchMap(({ perfil }) =>
        this.authRepository.updatePerfil(perfil).pipe(
          map(response => updateSuccess({ response })),
          catchError(error => of(updateFailure({ error })))
        )
      )
    )
  );

  updatePerfilSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateSuccess),
        tap(({ response }) => {
          const cookieOptions = this.cookieService.getAuthCookieOptions(environment.cookieTime);
          const usuarioCookie = this.cookieService.get(LOCALSTORAGE_KEYS.USER);

          this.cookieService.set(
            LOCALSTORAGE_KEYS.USER,
            JSON.stringify({ ...JSON.parse(usuarioCookie), ...response.usuario }),
            cookieOptions
          );

          this.modalService.close('editar-perfil');
          this.alertaService.mostrarExito('Perfil actualizado exitosamente', 'Perfil');
        })
      ),
    { dispatch: false }
  );

  updateImagePerfil$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateImageRequest),
      switchMap(({ perfil }) =>
        this.authRepository.updateImagenPerfil(perfil.usuario_id, perfil.imagen).pipe(
          map(response =>
            updateImageSuccess({
              response: response,
            })
          ),
          catchError(error => of(updateImageFailure({ error })))
        )
      )
    )
  );

  updateImagePerfilSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateImageSuccess),
        tap(({ response }) => {
          const cookieOptions = this.cookieService.getAuthCookieOptions(environment.cookieTime);
          const usuarioCookie = this.cookieService.get(LOCALSTORAGE_KEYS.USER);

          this.cookieService.set(
            LOCALSTORAGE_KEYS.USER,
            JSON.stringify({ ...JSON.parse(usuarioCookie), imagen: response.imagen }),
            cookieOptions
          );

          this.alertaService.mostrarExito('Imagen actualizada exitosamente', 'Imagen');
        })
      ),
    { dispatch: false }
  );
}
