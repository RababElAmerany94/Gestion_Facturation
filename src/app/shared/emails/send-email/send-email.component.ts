import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/layout/services/toast.service';
import { ResultStatus } from 'app/core/enums/result-status';
import { DocumentParamterType } from 'app/core/enums/document-parameter-type.enum';
import { IMailModel } from 'app/core/models/general/mail.model';
import { AppSettings } from 'app/app-settings/app-settings';
import { DocumentParameterService } from 'app/pages/parametres/document-parameters/document-parameter.service';
import { IDevisParameters } from 'app/pages/parametres/document-parameters/document-parameter.model';

@Component({
    selector: 'kt-send-email',
    templateUrl: './send-email.component.html',
    styleUrls: ['send-email.component.scss']
})
export class SendEmailComponent implements OnInit {

    /** the title of dialog */
    title: string;

    /** form group */
    form: FormGroup;

    /** the list of emails */
    emails: string[] = [];

    /** the type of document */
    type: DocumentParamterType;

    constructor(
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService,
        private documentParametersService: DocumentParameterService,
        @Inject(MAT_DIALOG_DATA) public data: { title: string, emailsTo: string[], type: DocumentParamterType },
        public dialogRef: MatDialogRef<SendEmailComponent>
    ) {
        this.initializeForm();
        this.title = this.data.title;
        this.emails = this.data.emailsTo;
        this.type = this.data.type;
    }

    ngOnInit(): void {
        this.setDefaultValue();
    }

    /**
     * initialize form
     */
    initializeForm() {
        this.form = this.fb.group({
            emailTo: [null, [Validators.pattern(AppSettings.regexEmail)]],
            subject: [null, [Validators.required]],
            body: [null, [Validators.required]]
        });
    }

    /**
     * send email
     */
    send() {
        if (this.form.valid && this.emails.length > 0) {
            const emailModel: IMailModel = { ...this.form.value };
            emailModel.emailTo = this.emails;
            this.dialogRef.close(emailModel);
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * add email
     */
    addEmail(email: string[]) {
        if (email != null && email.length > 0) {
            this.emails = email;
        }
    }

    /** set default values */
    setDefaultValue() {
        this.documentParametersService.Get().subscribe(res => {
            if (res.status === ResultStatus.Succeed) {
                if (this.type === DocumentParamterType.Devis) {
                    const devisParameters = res.value.devis as IDevisParameters;
                    this.form.patchValue({
                        subject: this.emails.length === 0 ? devisParameters.sujetMail : null,
                        body: this.emails.length === 0 ? devisParameters.contenuMail : null
                    });
                }
            }
        });
    }
}
