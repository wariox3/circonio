export interface Movimiento {
  id: number;
  tipo: string;
  fecha: string;
  fecha_vence: string;
  vr_total: number;
  vr_afectado: number;
  vr_saldo: number;
  vr_saldo_enmascarado: string;
  documento_fisico: boolean;
  contenedor_movimiento_id: any;
  usuario_id: number;
  usuario_username: string;
}
