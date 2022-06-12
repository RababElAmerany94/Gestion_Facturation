import { FormGroup, ValidatorFn } from '@angular/forms';

export class FormHelper {

    /**
     * mark the form group touched
     * @param form the form group
     */
    static markFormAsTouched(form: FormGroup) {
        // tslint:disable-next-line: forin
        for (const inner in form.controls) {
            form.get(inner).markAsTouched();
        }
    }

    /**
     * update form control validator
     * @param form the form group
     * @param validators list of validators
     * @param formControlName form control name
     */
    static updateFormControlValidation(form: FormGroup, validators: ValidatorFn[], formControlName: string) {
        form.get(formControlName).setValidators(validators);
        form.get(formControlName).updateValueAndValidity();
    }

    /**
     * update form value and validity
     * @param form the form group
     */
    static updateFormValueAndValidity(form: FormGroup) {
        form.updateValueAndValidity();
    }

    /**
     * mark form group un touched
     * @param form the form group
     */
    static markFormAsUnTouched(form: FormGroup) {
        // tslint:disable-next-line: forin
        for (const inner in form.controls) {
            form.get(inner).markAsUntouched();
        }
    }
}
