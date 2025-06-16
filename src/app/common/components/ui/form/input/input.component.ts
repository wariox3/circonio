// src/app/shared/ui/input/input.component.ts
import { NgIf } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [NgIf],
  template: `
    <div>
      <label *ngIf="label" class="block text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <input
        [type]="type"
        [placeholder]="placeholder"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onBlur()"
        [disabled]="disabled"
        class="input"
      />
      @if (invalid && (dirty || touched)) {
        @for (error of getErrors(); track $index) {
          <p class="text-sm text-red-600 mt-1">
            {{ error }}
          </p>
        }
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label: string = ''; // Etiqueta del input
  @Input() placeholder: string = ''; // Placeholder
  @Input() type: string = 'text'; // Tipo de input (text, email, password, etc.)
  @Input() errors: { [key: string]: string } = {}; // Mapa de errores personalizados
  @Input() disabled: boolean = false;

  @Input() invalid: boolean | undefined = false;
  @Input() dirty: boolean | undefined = false;
  @Input() touched: boolean | undefined = false;

  value: string = ''; // Valor interno del input
  onChange: any = () => {}; // Función para notificar cambios
  onTouched: any = () => {}; // Función para notificar que el input fue tocado

  // Escribe el valor en el input
  writeValue(value: any): void {
    this.value = value || '';
  }

  // Registra la función para notificar cambios
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra la función para notificar que el input fue tocado
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Maneja el evento de entrada
  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value); // Notifica el cambio
    this.dirty = true; // Marca el control como "sucio"
  }

  // Maneja el evento de blur
  onBlur(): void {
    this.onTouched(); // Notifica que el input fue tocado
    this.touched = true; // Marca el control como "tocado"
  }

  // Obtiene los mensajes de error
  getErrors(): string[] {
    if (!this.errors) return [];
    return Object.keys(this.errors).map(key => this.errors[key] || 'Error desconocido');
  }

  // Método para actualizar el estado de validación
  setInvalidState(isInvalid: boolean): void {
    this.invalid = isInvalid;
  }
}
