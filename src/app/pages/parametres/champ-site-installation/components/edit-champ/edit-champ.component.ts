import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IChampSiteInstallationModel } from '../../champ-site-installation.model';

@Component({
    selector: 'kt-edit-champ',
    templateUrl: './edit-champ.component.html'
})
export class EditChampComponent implements OnInit {

    form: FormGroup;
    mode: ModeEnum;
    title: string;
    champModel: IChampSiteInstallationModel;

    constructor(
        public dialogRef: MatDialogRef<EditChampComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            form: FormGroup,
            mode: ModeEnum,
            champModel: IChampSiteInstallationModel
        }
    ) { }

    ngOnInit() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        if (this.data.champModel != null) {
            this.champModel = this.data.champModel;
            this.setDataInForm(this.data.champModel);
        }
        this.title = this.getTitle();
    }

    /**
     * title
     */
    getTitle() {
        switch (this.mode) {
            case ModeEnum.Add:
                return 'CHAMPS_SITE_INTERVENTION.ADD_TITLE';

            case ModeEnum.Edit:
                return 'CHAMPS_SITE_INTERVENTION.EDIT_TITLE';
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
    setDataInForm(champ: IChampSiteInstallationModel) {
        this.form.setValue({
            name: champ.name,
        });
    }

    close() {
        this.dialogRef.close(true);
    }

}
