import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function lettersOnlyValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const isValid = /^[a-zA-Z]+$/.test(value); // Expresión regular que verifica si solo hay letras

    return isValid ? null : { lettersOnly: true }; // Devuelve null si es válido, o un error si no lo es
  };
}
