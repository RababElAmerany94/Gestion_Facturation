import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastService } from './../../../../core/layout/services/toast.service';

@Component({
    selector: 'kt-google-agenda',
    templateUrl: './google-agenda.component.html'
})
export class GoogleAgendaComponent implements OnInit {

    /** add event */
    @Output()
    saveCalendarId = new EventEmitter<string>();

    /** FormGroup */
    form: FormGroup;

    /**
     * the email will client share with it Google calendar
     */
    emailToShareWith = 'google-calendar-app@my_company-isolution-284610.iam.gserviceaccount.com'

    constructor(
        protected translate: TranslateService,
        private fb: FormBuilder,
        private toastService: ToastService,
    ) {
        this.initForm();
    }

    ngOnInit() {
    }
    //#region forms

    /**
     * initialize form
     */
    initForm() {
        this.form = this.fb.group({
            calendarId: [null, [Validators.required]],
        });
    }

    save() {
        if (this.form.valid) {
            this.saveCalendarId.emit(this.form.controls.calendarId.value);
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    //#endregion

}
