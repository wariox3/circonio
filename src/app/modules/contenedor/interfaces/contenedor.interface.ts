export interface Contenedor {
  id: number;
  usuario_id: number;
  contenedor_id: number;
  rol: string;
  subdominio: string;
  nombre: string;
  imagen: string;
  usuarios: number;
  usuarios_base: number;
  plan_id: number;
  plan_nombre: string;
  reddoc: boolean;
  ruteo: boolean;
  acceso_restringido: boolean;
}
