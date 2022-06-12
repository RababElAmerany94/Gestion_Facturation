import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { ITypeChauffage, ITypeChauffageModel } from '../../type-chauffage.model';

@Component({
    selector: 'kt-type-chauffage-edit',
    templateUrl: './type-chauffage-edit.component.html'
})
export class TypeChauffageEditComponent extends BaseEditTemplateComponent<ITypeChauffage> implements OnInit {

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
        public dialogRef: MatDialogRef<TypeChauffageEditComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            mode: ModeEnum,
            typeChauffage?: ITypeChauffage
        }
    ) {
        super();
    }

    ngOnInit() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        if (this.data.typeChauffage != null) {
            this.setDataInForm(this.data.typeChauffage);
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
    setDataInForm(typeChauffage: ITypeChauffageModel) {
        this.form.patchValue({
            name: typeChauffage.name,
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
                return 'TYPE_CHAUFFAGE.ADD_TITLE';

            case ModeEnum.Edit:
                return 'TYPE_CHAUFFAGE.EDIT_TITLE';

            case ModeEnum.Show:
                return 'TYPE_CHAUFFAGE.SHOW_TITLE';
        }
    }

}
