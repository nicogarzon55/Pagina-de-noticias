import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores personalizados para los formularios reactivos.
 * A diferencia de Validators.required / minLength de Angular, estos ignoran los
 * espacios al inicio y al final, así "     " no cuenta como texto válido.
 */
export class Validaciones {
  /** Campo obligatorio que no acepta solo espacios. */
  static obligatorio(control: AbstractControl): ValidationErrors | null {
    return String(control.value ?? '').trim() === '' ? { obligatorio: true } : null;
  }

  /** Longitud mínima sin contar los espacios de los extremos. */
  static minimo(n: number): ValidatorFn {
    return (control) => {
      const largo = String(control.value ?? '').trim().length;
      return largo > 0 && largo < n ? { minimo: { requerido: n, actual: largo } } : null;
    };
  }

  /** Longitud máxima sin contar los espacios de los extremos. */
  static maximo(n: number): ValidatorFn {
    return (control) => {
      const largo = String(control.value ?? '').trim().length;
      return largo > n ? { maximo: { permitido: n, actual: largo } } : null;
    };
  }

  /** Correo con forma nombre@dominio.ext (más estricto que Validators.email). */
  static correo(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim();
    return valor === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor) ? null : { correo: true };
  }

  /** URL opcional: vacía o que empiece por http:// o https://. */
  static urlOpcional(control: AbstractControl): ValidationErrors | null {
    const valor = String(control.value ?? '').trim();
    return valor === '' || /^https?:\/\/\S+\.\S+/.test(valor) ? null : { url: true };
  }
}

/** Enfoca el primer campo inválido dentro del formulario (accesibilidad). */
export function enfocarPrimerError(formulario: HTMLFormElement): void {
  formulario.querySelector<HTMLElement>('.ng-invalid[formControlName]')?.focus();
}
