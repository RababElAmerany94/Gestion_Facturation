import { Component, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubSink } from 'subsink';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'app/core/layout/services/toast.service';
import { ResultStatus } from 'app/core/enums/result-status';
import { UsersService } from 'app/pages/users/users.service';

@Component({
    selector: 'kt-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnDestroy {

    subs = new SubSink();

    /**
     * Form group
     */
    form: FormGroup;

    /**
     * the id of user
     */
    userId: string;

    /**
     * the form submitted
     */
    submitted = false;

    /**
     * change password
     */
    title = 'CHANGE_PASSWORD.TITLE';

    constructor(
        private userService: UsersService,
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<ChangePasswordComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { userId: string },
        private translate: TranslateService,
        private toastService: ToastService) {
        this.userId = this.data.userId;
        this.initForm();
    }

    initForm() {
        this.form = this.fb.group({
            password: ['', [Validators.required, Validators.minLength(7)]],
            confirmPassword: ['']
        }, { validator: this.checkPasswords });
    }

    checkPasswords(group: FormGroup) {
        const password = group.controls.password.value;
        const confirmPassword = group.controls.confirmPassword.value;
        return password === confirmPassword ? null : { passwordsDoNotMatch: true };
    }

    /**
     * save changes
     */
    save() {
        this.submitted = true;
        if (this.form.valid) {
            this.subs.sink = this.userService.UpdateUserPassword(this.userId, this.form.value.password)
                .subscribe(res => {
                    if (res.status === ResultStatus.Succeed) {
                        this.toastService.success(this.translate.instant('SUCCESS.EDIT'));
                        this.dialogRef.close();
                    } else {
                        this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                    }
                });
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

}
