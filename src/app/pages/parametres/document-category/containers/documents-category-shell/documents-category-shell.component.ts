import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { DialogHelper } from 'app/core/helpers/dialog';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { ICategoryDocument, ICategoryDocumentModel } from '../../category-document.model';
import { CategoryDocumentService } from '../../category-document.service';
import { EditDocumentsCategoryComponent } from '../../components/edit-documents-category/edit-documents-category.component';
import { StringHelper } from 'app/core/helpers/string';
import { Router } from '@angular/router';

@Component({
    selector: 'kt-documents-category-shell',
    templateUrl: './documents-category-shell.component.html'
})
export class DocumentsCategoryShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** the list of category documents */
    categoriesDocuments: IPagedResult<ICategoryDocument>;

    /** the current category documents */
    categoryDocuments: ICategoryDocument;

    /** the filter option */
    filterOption: IFilterOption;

    /** the form group */
    form: FormGroup;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private categoryDocumentService: CategoryDocumentService,
        protected toastService: ToastService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router) {
        super(translate, toastService, router);
        this.setModule(this.modules.Parameters);
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
            color: [null, [Validators.required]],
        });
    }

    //#endregion

    //#region service

    /**
     * get category documents as paged
     */
    getCategoryDocuments(filterOption: IFilterOption) {
        this.subs.sink = this.categoryDocumentService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.filterOption = filterOption;
                    this.categoriesDocuments = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * check reference are unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(categoryDocumentModel: ICategoryDocumentModel, isAdd: boolean, callback) {
        this.subs.sink = this.categoryDocumentService.IsUniqueName(categoryDocumentModel.name)
            .subscribe((result) => {
                if (
                    result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.categoryDocuments.name !== categoryDocumentModel.name)
                ) {
                    this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                    callback(false);
                    return;
                }
                callback(true);
                return;
            });
    }
    /**
     * add new category documents
     */
    addCategoryDocuments(categoryDocumentModel: ICategoryDocumentModel) {
        this.CheckReferenceIsUnique(categoryDocumentModel, true, (checkResult) => {
            if (checkResult) {
                this.categoryDocumentService.Add(categoryDocumentModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getCategoryDocuments(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit category documents
     */
    editCategoryDocuments(categoryDocumentModel: ICategoryDocumentModel) {
        this.CheckReferenceIsUnique(categoryDocumentModel, false, (checkResult: boolean) => {
            if (checkResult) {
                this.categoryDocumentService.Update(this.categoryDocuments.id, categoryDocumentModel)
                    .subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.toastEditSuccess();
                            this.getCategoryDocuments(this.filterOption);
                            this.categoriesDocuments.value[this.getIndexCurrentCategoryDocuments()] = result.value;
                            this.mode = ModeEnum.List;
                        } else {
                            this.toastErrorServer();
                        }
                    });
            }
        });
    }

    /**
     * delete category documents
     */
    deleteEvent(id: string) {
        this.subs.sink = this.categoryDocumentService.Delete(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.toastDeleteSuccess();
                    this.getCategoryDocuments(this.filterOption);
                    this.mode = ModeEnum.List;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    //#endregion

    //#region events

    /**
     * add event
     */
    addEvent() {
        this.categoryDocuments = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditDocumentsCategoryComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addCategoryDocuments(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(categoryDocument: ICategoryDocument) {
        this.categoryDocuments = this.categoriesDocuments.value.find(e => e.id === categoryDocument.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditDocumentsCategoryComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            categoryDocument: this.categoryDocuments,
        }).subscribe((result) => {
            if (result != null && result !== '') {
                this.editCategoryDocuments(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(categoryDocument: ICategoryDocument) {
        this.categoryDocuments = this.categoriesDocuments.value.find(e => e.id === categoryDocument.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditDocumentsCategoryComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            categoryDocument: this.categoryDocuments,
            mode: ModeEnum.Show
        });
    }

    //#endregion

    //#region helpers

    /**
     * get index of current category documents
     */
    getIndexCurrentCategoryDocuments(): number {
        return this.categoriesDocuments.value.findIndex(e => e.id === this.categoryDocuments.id);
    }

    //#endregion

}
