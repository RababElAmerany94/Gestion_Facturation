import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModeleSMSService } from './../../modele-sms.service';
import { CopyHelper } from './../../../../../core/helpers/copy';
import { EditModeleSmsComponent } from './../../components/edit-modele-sms/edit-modele-sms.component';
import { StringHelper } from './../../../../../core/helpers/string';
import { DialogHelper } from './../../../../../core/helpers/dialog';
import { ModeEnum } from './../../../../../core/enums/mode.enum';
import { ResultStatus } from './../../../../../core/enums/result-status';
import { IModeleSMSModel, IModeleSMS } from './../../modele-sms.model';
import { IPagedResult } from './../../../../../core/models/general/result-model';
import { TranslationService } from 'app/core/layout/services/translation.service';
import { ToastService } from 'app/core/layout/services/toast.service';
import { BaseContainerTemplateComponent } from './../../../../../shared/base-features/base-container.component';
import { IFilterOption } from 'app/core/models/general/filter-option.model';


@Component({
    selector: 'kt-modele-sms',
    templateUrl: './modele-sms.component.html'
})
export class ModeleSmsComponent extends BaseContainerTemplateComponent implements OnInit {

    /** list of Modele SMS */
    modelesSMS: IPagedResult<IModeleSMS>;

    /** the current Modele SMS */
    modeleSMS: IModeleSMS;

    /** the filter option */
    filterOption: IFilterOption;

    /** the form group */
    form: FormGroup;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private modeleSMSService: ModeleSMSService,
        protected toastService: ToastService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.ModeleSms);
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
            text: [null, [Validators.required]],
        });
    }

    //#endregion

    // #region services

    /**
     * get Modele SMS as paged
     */
    getModeleSMS(filterOption: IFilterOption) {
        this.subs.sink = this.modeleSMSService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.filterOption = filterOption;
                this.modelesSMS = result;
            });
    }

    /**
     * check username and password are unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(modeleSMSModel: IModeleSMSModel, isAdd: boolean, callback) {
        this.subs.sink = this.modeleSMSService.IsUniqueName(modeleSMSModel.name)
            .subscribe((result) => {
                if (
                    result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.modeleSMS.name !== modeleSMSModel.name)
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
     * add new Modele SMS
     */
    addModeleSMS(modeleSMSModel: IModeleSMSModel) {
        this.CheckReferenceIsUnique(modeleSMSModel, true, (checkResult) => {
            if (checkResult) {
                this.modeleSMSService.Add(modeleSMSModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getModeleSMS(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit Modele SMS
     */
    editModeleSMS(modeleSMS: IModeleSMSModel) {
        this.CheckReferenceIsUnique(modeleSMS, false, (checkResult: boolean) => {
            if (checkResult) {
                this.modeleSMSService.Update(this.modeleSMS.id, modeleSMS)
                    .subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.modelesSMS.value[this.getIndexCurrentModeleSMS()] = result.value;
                            this.modelesSMS = CopyHelper.copy(this.modelesSMS);
                            this.toastEditSuccess();
                        } else {
                            this.toastErrorServer();
                        }
                    });
            }
        });
    }

    /**
     * delete Modele SMS
     */
    deleteEvent(id: string) {
        this.subs.sink = this.modeleSMSService.Delete(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.toastDeleteSuccess();
                    this.getModeleSMS(this.filterOption);
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
        this.modeleSMS = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditModeleSmsComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addModeleSMS(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(modeleSMS: IModeleSMS) {
        this.modeleSMS = this.modelesSMS.value.find(e => e.id === modeleSMS.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditModeleSmsComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            mode: ModeEnum.Edit,
            modeleSMS: this.modeleSMS,
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.editModeleSMS(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(modeleSMS: IModeleSMS) {
        this.modeleSMS = this.modelesSMS.value.find(e => e.id === modeleSMS.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditModeleSmsComponent, DialogHelper.SIZE_MEDIUM, {
            form: this.form,
            modeleSMS: this.modeleSMS,
            mode: ModeEnum.Show
        });
    }

    // #endregion

    // #region helpers

    /**
     * get index of current Modele SMS
     */
    getIndexCurrentModeleSMS(): number {
        return this.modelesSMS.value.findIndex(e => e.id === this.modeleSMS.id);
    }

    // #endregion
}
