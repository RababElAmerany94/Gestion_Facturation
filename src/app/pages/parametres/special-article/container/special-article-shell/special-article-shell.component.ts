import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { SpecialArticleEditComponent } from '../../components/special-article-edit/special-article-edit.component';
import { ISpecialArticle, ISpecialArticleModel } from '../../special-artical.model';
import { SpecialArticleService } from '../../special-article.service';
import { Router } from '@angular/router';
import { UserHelper } from 'app/core/helpers/user';

@Component({
    selector: 'kt-special-article-shell',
    templateUrl: './special-article-shell.component.html'
})
export class SpecialArticleShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** the form group */
    form: FormGroup;

    /** the form group */
    specialArticle: ISpecialArticle;

    /** the form group */
    specialArticles: IPagedResult<ISpecialArticle>;

    /** the filter option */
    filterOption: IFilterOption;

    constructor(
        private fb: FormBuilder,
        protected toastService: ToastService,
        protected translate: TranslateService,
        private translationService: TranslationService,
        private dialog: MatDialog,
        private specialArticleService: SpecialArticleService,
        protected router: Router
    ) {
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
            designation: [null, [Validators.required]],
            description: [null, [Validators.required]],
        });
    }

    //#endregion

    //#region service

    /**
     * get special article as paged
     */
    getSpecialArticle(filterOption: IFilterOption) {
        this.subs.sink = this.specialArticleService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.filterOption = filterOption;
                    this.specialArticles = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * check reference is unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(specialArticleModel: ISpecialArticleModel, isAdd: boolean, callback) {
        this.subs.sink = this.specialArticleService.IsUniqueName(specialArticleModel.designation)
            .subscribe((result) => {
                if (
                    result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.specialArticle.designation !== specialArticleModel.designation)
                ) {
                    this.toastService.error(this.translate.instant('ERRORS.DESIGNATION_NOT_UNIQUE'));
                    callback(false);
                    return;
                }
                callback(true);
                return;
            });
    }

    /**
     * add new special article
     */
    addSpecialArticle(specialArticleModel: ISpecialArticleModel) {
        specialArticleModel.agenceId = UserHelper.getAgenceId();
        this.CheckReferenceIsUnique(specialArticleModel, true, (checkResult) => {
            if (checkResult) {
                this.specialArticleService.Add(specialArticleModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getSpecialArticle(this.filterOption);
                        this.mode = ModeEnum.List;
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit special article
     */
    editSpecialArticle(specialArticleModel: ISpecialArticleModel) {
        this.CheckReferenceIsUnique(specialArticleModel, false, (checkResult: boolean) => {
            if (checkResult) {
                this.specialArticleService.Update(this.specialArticle.id, specialArticleModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastEditSuccess();
                        this.getSpecialArticle(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * delete special article
     */
    deleteEvent(id: string) {
        this.subs.sink = this.specialArticleService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getSpecialArticle(this.filterOption);
                this.modeList();
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
        this.specialArticle = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, SpecialArticleEditComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addSpecialArticle(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(specialArticle: ISpecialArticle) {
        this.specialArticle = this.specialArticles.value.find(e => e.id === specialArticle.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, SpecialArticleEditComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            mode: ModeEnum.Edit,
            specialArticle: this.specialArticle,
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.editSpecialArticle(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(specialArticle: ISpecialArticle) {
        this.specialArticle = this.specialArticles.value.find(e => e.id === specialArticle.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, SpecialArticleEditComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            specialArticle: this.specialArticle,
            mode: ModeEnum.Show
        });
    }

    //#endregion

}
