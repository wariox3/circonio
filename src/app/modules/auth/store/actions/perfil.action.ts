import { createAction, props } from '@ngrx/store';
import { Usuario } from '../../interfaces/usuario.interface';
import { UpdateImageResponse, UpdateResponse } from '../../interfaces/auth.interface';

export const enum LoginActionTypes {
  UPDATE_REQUEST = '[Perfil] Actualizar',
  UPDATE_SUCCESS = '[Perfil] Actualizar Success',
  UPDATE_FAILURE = '[Perfil] Actualizar Failure',
  UPDATE_IMAGE_REQUEST = '[Perfil] Actualizar Imagen',
  UPDATE_IMAGE_SUCCESS = '[Perfil] Actualizar Imagen Success',
  UPDATE_IMAGE_FAILURE = '[Perfil] Actualizar Imagen Failure',
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

export const updateImageRequest = createAction(
  LoginActionTypes.UPDATE_IMAGE_REQUEST,
  props<{ perfil: { imagen: string; usuario_id: string } }>()
);

export const updateImageSuccess = createAction(
  LoginActionTypes.UPDATE_IMAGE_SUCCESS,
  props<{ response: UpdateImageResponse }>()
);

export const updateImageFailure = createAction(
  LoginActionTypes.UPDATE_IMAGE_FAILURE,
  props<{ error: any }>()
);
