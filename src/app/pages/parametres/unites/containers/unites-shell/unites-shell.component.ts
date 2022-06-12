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
import { IUnite, IUniteModel } from 'app/core/models/unite/unite.model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { EditUniteComponent } from '../../components/edit-unite/edit-unite.component';
import { UnitesService } from '../../unites.service';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Router } from '@angular/router';

@Component({
    selector: 'kt-unites-shell',
    templateUrl: './unites-shell.component.html'
})
export class UnitesShellComponent extends BaseContainerTemplateComponent implements OnInit {

    unites: IPagedResult<IUnite>;
    unite: IUnite;
    form: FormGroup;
    filterOption: IFilterOption;

    constructor(
        private fb: FormBuilder,
        private uniteService: UnitesService,
        protected translate: TranslateService,
        private translationService: TranslationService,
        protected toastService: ToastService,
        private dialogMat: MatDialog,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Parameters);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    /**
     * initialization form
     */

    initializationForm() {
        this.form = this.fb.group({
            name: [null, [Validators.required]],
            abbreviation: [null]
        });
    }

    // #region services

    /**
     * get unites as page
     */
    getUnites(filterOption: IFilterOption) {
        this.subs.sink = this.uniteService.GetAsPagedResult(filterOption).subscribe(result => {
            this.unites = result;
            this.filterOption = filterOption;
        });
    }

    /**
     * check username and password are unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(uniteModel: IUniteModel, isAdd: boolean, callback) {
        this.subs.sink = this.uniteService.IsUniqueName(uniteModel.name).subscribe((result) => {
            if (result.status === ResultStatus.Succeed &&
                !result.value &&
                (isAdd ? true : this.unite.name !== uniteModel.name)) {
                this.toastService.error(this.translate.instant('ERRORS.NAME_NOT_UNIQUE'));
                callback(false);
                return;
            }
            callback(true);
        });
    }

    /**
     * add new unite
     */
    addUnites(uniteModel: IUniteModel) {
        this.CheckReferenceIsUnique(uniteModel, true, (checkUnique) => {
            if (checkUnique) {
                this.uniteService.Add(uniteModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getUnites(this.filterOption);
                        this.mode = ModeEnum.List;
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * update unite
     */
    updateUnite(uniteModel: IUniteModel) {
        this.CheckReferenceIsUnique(uniteModel, false, (checkUnique) => {
            if (checkUnique) {
                this.uniteService.Update(this.unite.id, uniteModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastEditSuccess();
                        this.getUnites(this.filterOption);
                        this.mode = ModeEnum.List;
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * delete Unite
     */
    deleteUnite(id: string) {
        this.uniteService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getUnites(this.filterOption);
                this.mode = ModeEnum.List;
            } else {
                this.toastErrorServer();
            }
        });

    }

    // #endregion

    //region events

    /**
     * add event
     */
    addEvent() {
        this.unite = null;
        this.initializationForm();
        DialogHelper.openDialog(this.dialogMat, EditUniteComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addUnites(result);
            }
        });

    }
    /**
     * edit event
     */
    editEvent(uniteModel: IUnite) {
        this.unite = this.unites.value.find(e => e.id === uniteModel.id);
        this.initializationForm();
        DialogHelper.openDialog(this.dialogMat, EditUniteComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            uniteModel: this.unite
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.updateUnite(result);
            }
        });
    }

    // #endregion

}
