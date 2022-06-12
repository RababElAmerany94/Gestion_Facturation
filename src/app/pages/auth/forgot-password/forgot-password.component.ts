// Angular
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';

@Component({
    selector: 'kt-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
    // Public params
    forgotPasswordForm: FormGroup;
    loading = false;
    subsink = new SubSink();
    constructor(
        private fb: FormBuilder,
    ) {
    }

	/**
	 * On init
	 */
    ngOnInit() {
        this.initRegistrationForm();
    }

	/**
	 * On destroy
	 */
    ngOnDestroy(): void {
        this.subsink.unsubscribe();
        this.loading = false;
    }

	/**
	 * Form initalization
	 * Default params, validators
	 */
    initRegistrationForm() {
        this.forgotPasswordForm = this.fb.group({
            email: ['', Validators.compose([
                Validators.required,
                Validators.email,
                Validators.minLength(3),
                Validators.maxLength(320)
            ])
            ]
        });
    }

	/**
	 * Form Submit
	 */
    submit() {
        const formvalue = this.forgotPasswordForm.value;
        // Todo
    }

}
