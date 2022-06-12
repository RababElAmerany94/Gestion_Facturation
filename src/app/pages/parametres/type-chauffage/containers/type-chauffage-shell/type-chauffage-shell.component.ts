import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
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
import { TypeChauffageEditComponent } from '../../components/type-chauffage-edit/type-chauffage-edit.component';
import { ITypeChauffage, ITypeChauffageModel } from '../../type-chauffage.model';
import { TypeChauffageService } from '../../type-chauffage.service';

@Component({
    selector: 'kt-type-chauffage-shell',
    templateUrl: './type-chauffage-shell.component.html'
})
export class TypeChauffageShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** the form group */
    form: FormGroup;

    /** the form group */
    typeChauffage: ITypeChauffage;

    /** the form group */
    typeChauffages: IPagedResult<ITypeChauffage>;

    /** the filter option */
    filterOption: IFilterOption;

    constructor(
        private fb: FormBuilder,
        protected toastService: ToastService,
        protected translate: TranslateService,
        private translationService: TranslationService,
        private dialog: MatDialog,
        private typeChauffageService: TypeChauffageService,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.TypeChauffage);
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
        });
    }

    //#endregion

    //#region service

    /**
     * get type Chauffage as paged
     */
    getTypeChauffage(filterOption: IFilterOption) {
        this.subs.sink = this.typeChauffageService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.filterOption = filterOption;
                    this.typeChauffages = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * check reference is unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(typeChauffageModel: ITypeChauffageModel, isAdd: boolean, callback) {
        this.subs.sink = this.typeChauffageService.IsUniqueName(typeChauffageModel.name)
            .subscribe((result) => {
                if (
                    result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.typeChauffage.name !== typeChauffageModel.name)
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
     * add new type Chauffage
     */
    addTypeChauffage(typeChauffageModel: ITypeChauffageModel) {
        this.CheckReferenceIsUnique(typeChauffageModel, true, (checkResult) => {
            if (checkResult) {
                this.typeChauffageService.Add(typeChauffageModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getTypeChauffage(this.filterOption);
                        this.mode = ModeEnum.List;
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit type Chauffage
     */
    editTypeChauffage(typeChauffageModel: ITypeChauffageModel) {
        this.CheckReferenceIsUnique(typeChauffageModel, false, (checkResult: boolean) => {
            if (checkResult) {
                this.typeChauffageService.Update(this.typeChauffage.id, typeChauffageModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastEditSuccess();
                        this.getTypeChauffage(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * delete type Chauffage
     */
    deleteEvent(id: string) {
        this.subs.sink = this.typeChauffageService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getTypeChauffage(this.filterOption);
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
        this.typeChauffage = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, TypeChauffageEditComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addTypeChauffage(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(typeChauffage: ITypeChauffage) {
        this.typeChauffage = this.typeChauffages.value.find(e => e.id === typeChauffage.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, TypeChauffageEditComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            mode: ModeEnum.Edit,
            typeChauffage: this.typeChauffage,
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.editTypeChauffage(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(typeChauffage: ITypeChauffage) {
        this.typeChauffage = this.typeChauffages.value.find(e => e.id === typeChauffage.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, TypeChauffageEditComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            typeChauffage: this.typeChauffage,
            mode: ModeEnum.Show
        });
    }

    //#endregion
}
