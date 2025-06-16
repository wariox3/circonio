import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TelefonoUtilService {
  /**
   * Procesa un número de teléfono completo (con indicativo) y devuelve un objeto
   * con el indicativo del país y el número local separados.
   *
   * @param fullPhoneNumber - Número de teléfono completo (ej: "+57 3163557856")
   * @returns Un objeto con el indicativo y el número local
   */
  procesarNumeroTelefono(fullPhoneNumber: string): { indicativo: string; numero: string } {
    // Si el número es nulo o vacío, devolver valores por defecto
    if (!fullPhoneNumber || fullPhoneNumber.trim() === '') {
      return { indicativo: '', numero: '' };
    }

    // Limpiamos el string de espacios
    const numeroLimpio = fullPhoneNumber.trim();

    // Expresión regular para extraer el indicativo (formato +XX o +XXX)
    const regexIndicativo = /^\+(\d{1,3})/;
    const matchIndicativo = numeroLimpio.match(regexIndicativo);

    // Si no hay coincidencia, asumimos que no tiene indicativo
    if (!matchIndicativo) {
      return { indicativo: '', numero: numeroLimpio };
    }

    // Extraemos el indicativo con el signo +
    const indicativo = '+' + matchIndicativo[1];

    // Extraemos el número local (todo lo que viene después del indicativo y posibles espacios)
    const numero = numeroLimpio.replace(regexIndicativo, '').trim();

    return { indicativo, numero };
  }

  /**
   * Combina un indicativo de país y un número local en un formato estándar
   *
   * @param indicativo - Indicativo del país (ej: "+57")
   * @param numero - Número local (ej: "3163557856")
   * @returns Número de teléfono completo (ej: "+57 3163557856")
   */
  combinarNumeroTelefono(indicativo: string, numero: string): string {
    if (!indicativo || indicativo.trim() === '') {
      return numero || '';
    }

    const indicativoLimpio = indicativo.trim().startsWith('+')
      ? indicativo.trim()
      : '+' + indicativo.trim();

    return `${indicativoLimpio} ${numero?.trim() || ''}`.trim();
  }
}
