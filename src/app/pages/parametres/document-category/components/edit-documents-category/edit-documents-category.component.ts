import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICategoryDocument } from '../../category-document.model';

@Component({
    selector: 'kt-edit-documents-category',
    templateUrl: './edit-documents-category.component.html'
})
export class EditDocumentsCategoryComponent implements OnInit {

    /**
     * the form group
     */
    form: FormGroup;

    /**
     * mode of dialog
     */
    mode = ModeEnum.Add;

    /**
     * mode show of dialog
     */
    modeShow: boolean;

    /**
     * title of dialog
     */
    title: string;

    constructor(
        public dialogRef: MatDialogRef<EditDocumentsCategoryComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            mode: ModeEnum,
            categoryDocument?: ICategoryDocument
        }
    ) { }

    ngOnInit() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        if (this.data.categoryDocument != null) {
            this.setDataInForm(this.data.categoryDocument);
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
     * set data in form
     */
    setDataInForm(categoryDocument: ICategoryDocument) {
        this.form.patchValue({
            name: categoryDocument.name,
            color: categoryDocument.color,
        });
    }

    /**
     * save changes
     */
    save() {
        if (this.form.valid) {
            this.dialogRef.close(this.form.getRawValue());
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * get titles translated
     */
    getTitle() {
        switch (this.mode) {
            case ModeEnum.Add:
                return 'CATEGORY_DOCUMENTS.ADD_TITLE';

            case ModeEnum.Edit:
                return 'CATEGORY_DOCUMENTS.EDIT_TITLE';

            case ModeEnum.Show:
                return 'CATEGORY_DOCUMENTS.SHOW_TITLE';
        }
    }
}
