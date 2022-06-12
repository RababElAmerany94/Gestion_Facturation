import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'app/core/layout/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { ISpecialArticle, ISpecialArticleModel } from '../../special-artical.model';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';

@Component({
    selector: 'kt-special-article-edit',
    templateUrl: './special-article-edit.component.html'
})
export class SpecialArticleEditComponent extends BaseEditTemplateComponent<ISpecialArticle> implements OnInit {

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
        public dialogRef: MatDialogRef<SpecialArticleEditComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            mode: ModeEnum,
            specialArticle?: ISpecialArticle
        }
    ) {
        super();
     }

    ngOnInit() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        if (this.data.specialArticle != null) {
            this.setDataInForm(this.data.specialArticle);
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
    setDataInForm(specialArticle: ISpecialArticleModel) {
        this.form.patchValue({
            designation: specialArticle.designation,
            description: specialArticle.description,
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
                return 'ARTICLES_SPECIAUX.ADD_TITLE';

            case ModeEnum.Edit:
                return 'ARTICLES_SPECIAUX.EDIT_TITLE';

            case ModeEnum.Show:
                return 'ARTICLES_SPECIAUX.SHOW_TITLE';
        }
    }
}
