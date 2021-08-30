import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";

export class ErrorStateFrequencyMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const invalidCtrl = !!(control && control.invalid);
    const invalidParent = !!(
      control &&
      control.parent &&
      control.parent.invalid
    );
    return invalidCtrl || invalidParent;
  }
}
