import { createReducer, on } from '@ngrx/store';
import { getCookie } from 'typescript-cookie';
import { Usuario } from '../../interfaces/usuario.interface';
import { loginRequest, loginSuccess, loginFailure, logout } from '../actions/login.action';
import {
  removeImageFailure,
  removeImageRequest,
  removeImageSuccess,
  updateFailure,
  updateImageFailure,
  updateImageRequest,
  updateImageSuccess,
  updateRequest,
  updateSuccess,
} from '../actions/perfil.action';
import { LOCALSTORAGE_KEYS } from '@app/core/constants/localstorage-keys.constant';

// Definir la interfaz del estado de autenticación
export interface AuthState {
  user: Usuario | null;
  loading: boolean;
  error: any | null;
  isAuthenticated: boolean;
}

// Estado inicial con rehidratación desde cookie
const userCookie: string | undefined = getCookie(LOCALSTORAGE_KEYS.USER);

// Estado inicial por defecto
const defaultState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

// Rehidratar el estado desde la cookie si existe
export const initialState: AuthState = userCookie
  ? {
      user: JSON.parse(userCookie),
      loading: false,
      error: null,
      isAuthenticated: true,
    }
  : defaultState;

export const authReducer = createReducer(
  initialState,

  // Manejar la acción de solicitud de login
  on(loginRequest, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Manejar el éxito del login
  on(loginSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    loading: false,
    error: null,
    isAuthenticated: true,
  })),

  // Manejar el error de login
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  // Manejar el logout
  on(logout, () => ({
    ...defaultState,
  })),

  // Manejar la acción de solicitud de perfil
  on(updateRequest, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Manejar el éxito del perfil
  on(updateSuccess, (state, { response }) => ({
    ...state,
    user: { ...state.user, ...response.usuario },
    loading: false,
    error: null,
    isAuthenticated: true,
  })),

  // Manejar el error del perfil
  on(updateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  // Manejar la acción de solicitud de perfil
  on(updateImageRequest, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Manejar el éxito del perfil
  on(updateImageSuccess, (state, { response }) => ({
    ...state,
    user: { ...state.user, imagen: response.imagen },
    loading: false,
    error: null,
    isAuthenticated: true,
  })),

  // Manejar el error del perfil
  on(updateImageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  // Manejar la acción de solicitud de perfil
  on(removeImageRequest, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Manejar el éxito del perfil
  on(removeImageSuccess, (state, { response }) => ({
    ...state,
    user: {
      ...state.user,
      imagen: response.imagen,
      imagen_thumbnail: response.imagen_thumbnail,
    },
    loading: false,
    error: null,
    isAuthenticated: true,
  })),

  // Manejar el error del perfil
  on(removeImageFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  }))
);
