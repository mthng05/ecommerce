import { FormControl, ValidationErrors } from "@angular/forms";

export class EcommerceValidators {

  static notOnlyWhiteSpace(control: FormControl) : ValidationErrors | null {

    if (control.value == null) return null;
    
    const trimmedValue = control.value.trim();
    
    if (trimmedValue == null || trimmedValue.length === 0) {
      return {'notOnlyWhiteSpace': true};
    } 

    if (trimmedValue.length < 2) {
      return {'minlength': {
        requiredLength: 2,
        actualLength: trimmedValue.length
      }};
    }
    return null;
  }
}
