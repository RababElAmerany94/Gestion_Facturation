import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IUniteModel } from 'app/core/models/unite/unite.model';

@Component({
    selector: 'kt-edit-unite',
    templateUrl: './edit-unite.component.html'
})
export class EditUniteComponent implements OnInit {

    form: FormGroup;
    mode: ModeEnum;
    title: string;
    uniteModel: IUniteModel;

    constructor(
        public dialogRef: MatDialogRef<EditUniteComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            form: FormGroup,
            mode: ModeEnum,
            uniteModel: IUniteModel
        }
    ) { }

    ngOnInit() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        if (this.data.uniteModel != null) {
            this.uniteModel = this.data.uniteModel;
            this.setDataInForm(this.data.uniteModel);
        }
        this.title = this.getTitle();
    }

    /**
     * title
     */
    getTitle() {
        switch (this.mode) {
            case ModeEnum.Add:
                return 'UNITE.ADD_TITLE';

            case ModeEnum.Edit:
                return 'UNITE.EDIT_TITLE';
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
    setDataInForm(unite) {
        this.form.setValue({
            name: unite.name,
            abbreviation: unite.abbreviation
        });
    }

    close() {
        this.dialogRef.close(true);
    }

}
