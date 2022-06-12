import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { ICategoryProduct, ICategoryProductModel } from '../../category-product.model';
import { CategoryProductService } from '../../category-product.service';
import { EditProductCategoryComponent } from '../../components/edit-product-category/edit-product-category.component';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { CopyHelper } from 'app/core/helpers/copy';
import { Router } from '@angular/router';

@Component({
    selector: 'kt-product-category-shell',
    templateUrl: './product-category-shell.component.html'
})
export class ProductCategoryShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** list of categories product */
    categoryProducts: IPagedResult<ICategoryProduct>;

    /** the current category product */
    categoryProduct: ICategoryProduct;

    /** the filter option */
    filterOption: IFilterOption;

    /** the form group */
    form: FormGroup;


    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private categoryProductService: CategoryProductService,
        protected toastService: ToastService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.CategoryProduct);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    //#region form

    /**
     * initialization form
     */
    initForm() {
        this.form = this.fb.group({
            name: [null, [Validators.required]],
            accountingCode: [null, [Validators.required]],
        });
    }

    //#endregion

    // #region services

    /**
     * get category product as paged
     */
    getCategoryProducts(filterOption: IFilterOption) {
        this.subs.sink = this.categoryProductService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.filterOption = filterOption;
                this.categoryProducts = result;
            });
    }

    /**
     * check username and password are unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(categoryProductModel: ICategoryProductModel, isAdd: boolean, callback) {
        this.subs.sink = this.categoryProductService.IsUniqueName(categoryProductModel.name)
            .subscribe((result) => {
                if (
                    result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.categoryProduct.name !== categoryProductModel.name)
                ) {
                    this.toastService.error(this.translate.instant('ERRORS.NAME_NOT_UNIQUE'));
                    callback(false);
                    return;
                }
                callback(true);
                return;
            });
    }


    /**
     * add new category product
     */
    addCategoryProduct(categoryProductModel: ICategoryProductModel) {
        this.CheckReferenceIsUnique(categoryProductModel, true, (checkResult) => {
            if (checkResult) {
                this.categoryProductService.Add(categoryProductModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getCategoryProducts(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit category product
     */
    editCategoryProduct(categoryProduct: ICategoryProductModel) {
        this.CheckReferenceIsUnique(categoryProduct, false, (checkResult: boolean) => {
            if (checkResult) {
                this.categoryProductService.Update(this.categoryProduct.id, categoryProduct)
                    .subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.categoryProducts.value[this.getIndexCurrentCategoryProduct()] = result.value;
                            this.categoryProducts = CopyHelper.copy(this.categoryProducts);
                            this.toastEditSuccess();
                        } else {
                            this.toastErrorServer();
                        }
                    });
            }
        });
    }

    /**
     * delete category product
     */
    deleteEvent(id: string) {
        this.subs.sink = this.categoryProductService.Delete(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.toastDeleteSuccess();
                    this.getCategoryProducts(this.filterOption);
                    this.modeList();
                } else {
                    this.toastErrorServer();
                }
            });
    }

    // #endregion

    // #region events

    /**
     * add event
     */
    addEvent() {
        this.categoryProduct = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditProductCategoryComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addCategoryProduct(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(categoryProduct: ICategoryProduct) {
        this.categoryProduct = this.categoryProducts.value.find(e => e.id === categoryProduct.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditProductCategoryComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            categoryProduct: this.categoryProduct,
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.editCategoryProduct(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(categoryProduct: ICategoryProduct) {
        this.categoryProduct = this.categoryProducts.value.find(e => e.id === categoryProduct.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditProductCategoryComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            categoryProduct: this.categoryProduct,
            mode: ModeEnum.Show
        });
    }

    // #endregion

    // #region helpers

    /**
     * get index of current category product
     */
    getIndexCurrentCategoryProduct(): number {
        return this.categoryProducts.value.findIndex(e => e.id === this.categoryProduct.id);
    }

    // #endregion

}
