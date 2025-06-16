import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../interfaces/usuario.interface';
import { UpdateResponse } from '../../interfaces/auth.interface';

export const enum LoginActionTypes {
  UPDATE_REQUEST = '[Perfil] Actualizar',
  UPDATE_SUCCESS = '[Perfil] Actualizar Success',
  UPDATE_FAILURE = '[Perfil] Actualizar Failure',
}

export const updateRequest = createAction(
  LoginActionTypes.UPDATE_REQUEST,
  props<{ perfil: Partial<Usuario> }>()
);

export const updateSuccess = createAction(
  LoginActionTypes.UPDATE_SUCCESS,
  props<{ response: UpdateResponse }>()
);

export const updateFailure = createAction(LoginActionTypes.UPDATE_FAILURE, props<{ error: any }>());
