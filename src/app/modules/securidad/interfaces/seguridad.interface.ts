export interface CambiarPassword {
  usuarioId: string;
  password: string;
}

export interface CambiarPasswordResponse {
  cambio: boolean;
}
