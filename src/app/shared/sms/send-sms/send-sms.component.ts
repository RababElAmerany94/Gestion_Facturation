import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { IModeleSMS } from './../../../pages/parametres/modele-sms/modele-sms.model';
import { StringHelper } from './../../../core/helpers/string';
import { SelectModeleComponent } from './../select-modele/select-modele.component';
import { DialogHelper } from './../../../core/helpers/dialog';
import { AppSettings } from './../../../app-settings/app-settings';
import { ToastService } from './../../../core/layout/services/toast.service';
import { IEnvoyerSmsModel, ISms } from '../sms.model';

@Component({
    selector: 'kt-send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.scss']
})
export class SendSmsComponent implements OnInit {

    /** form group */
    form: FormGroup;

    /** the list of sms */
    sms: ISms[] = [];

    smsModel: IModeleSMS;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService,
        public dialogRef: MatDialogRef<SendSmsComponent>,
        private matDialog: MatDialog,
    ) {
        this.initializeForm();
    }

    ngOnInit(): void {
    }

    /**
     * initialize form
     */
    initializeForm() {
        this.form = this.fb.group({
            numeroTelephone: [null, [Validators.required, Validators.pattern(AppSettings.regexPhone)]],
            message: [null, [Validators.required]],
        });
    }

    /**
     * send sms
     */
    send() {
        if (this.form.valid) {
            const smsModel: IEnvoyerSmsModel = { ...this.form.value };
            this.dialogRef.close(smsModel);
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * add sms
     */
    /*addSms(sms: string[]) {
        if (sms != null && sms.length > 0) {
            this.sms = sms;
        }
    }*/

    /** open Modele Details */
    openModeleDetails(){
        DialogHelper.openDialog(this.matDialog, SelectModeleComponent, DialogHelper.SIZE_MEDIUM, null)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.smsModel = result;
                    this.form.get('message').setValue(result.text);
                }
            });
    }
}
