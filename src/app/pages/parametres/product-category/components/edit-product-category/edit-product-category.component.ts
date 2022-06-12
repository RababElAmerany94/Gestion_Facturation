import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { ICategoryProduct } from '../../category-product.model';

@Component({
    selector: 'kt-edit-product-category',
    templateUrl: './edit-product-category.component.html',
})
export class EditProductCategoryComponent implements OnInit {

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
        public dialogRef: MatDialogRef<EditProductCategoryComponent>,
        private toastService: ToastService,
        private translate: TranslateService,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: FormGroup,
            typesCategoryProduct: IDropDownItem<number, string>[],
            mode: ModeEnum,
            categoryProduct?: ICategoryProduct
        }
    ) { }

    ngOnInit(): void {
        this.initComponent();
    }

    /**
     * initialize component
     */
    initComponent() {
        this.form = this.data.form;
        this.mode = this.data.mode;
        this.title = this.getTitle();
        this.initForm();
    }

    /**
     * init form
     */
    initForm() {
        if (this.data.categoryProduct != null) {
            this.setDataInForm(this.data.categoryProduct);
        }
        if (this.data.mode === ModeEnum.Show) {
            this.modeShow = true;
            this.form.disable();
        } else {
            this.modeShow = false;
            this.form.enable();
        }
    }

    /**
     * set data in form
     */
    setDataInForm(categoryProduct: ICategoryProduct) {
        this.form.setValue({
            name: categoryProduct.name,
            accountingCode: categoryProduct.accountingCode,
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
                return 'CATEGORY_PRODUCT.ADD_TITLE';

            case ModeEnum.Edit:
                return 'CATEGORY_PRODUCT.EDIT_TITLE';

            case ModeEnum.Show:
                return 'CATEGORY_PRODUCT.SHOW_TITLE';
        }
    }

}
