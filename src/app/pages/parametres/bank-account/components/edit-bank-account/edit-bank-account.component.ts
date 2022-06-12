import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { IBankAccountModel } from './../../bank-account.model';
import { ToastService } from 'app/core/layout/services/toast.service';
import { ModeEnum } from 'app/core/enums/mode.enum';

@Component({
    selector: 'kt-edit-bank-account',
    templateUrl: './edit-bank-account.component.html'
})
export class EditBankAccountComponent implements OnInit {

    form: FormGroup;
    mode: ModeEnum;
    title: string;
    bankAccount: IBankAccountModel;

    /**
     * mode show of dialog
     */
    modeShow: boolean;

    constructor(
        public dialogRef: MatDialogRef<EditBankAccountComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            form: FormGroup,
            mode: ModeEnum,
            bankAccount: IBankAccountModel
        }
    ) {
    }

    ngOnInit() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        if (this.data.bankAccount != null) {
            this.bankAccount = this.data.bankAccount;
            this.setDataInForm(this.data.bankAccount);
        }
        if (this.data.mode === ModeEnum.Show) {
            this.modeShow = true;
            this.form.disable();
        } else {
            this.modeShow = false;
            this.form.enable();
        }
        this.title = this.getTitle();
    }

    /**
     * title
     */
    getTitle() {
        switch (this.mode) {
            case ModeEnum.Add:
                return 'BANK_ACCOUNT.ADD_TITLE';

            case ModeEnum.Edit:
                return 'BANK_ACCOUNT.EDIT_TITLE';
        }
    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * setData form
     */
    setDataInForm(bankAccount) {
        this.form.setValue({
            name: bankAccount.name,
            codeComptable: bankAccount.codeComptable,
            isModify: bankAccount.isModify
        });
    }

}
