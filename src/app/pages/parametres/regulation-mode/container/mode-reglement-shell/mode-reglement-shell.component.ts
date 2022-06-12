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
import { IRegulationMode, IRegulationModeModel } from 'app/core/models/regulation-mode/regulation-mode.model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { EditRegulationComponent } from '../../components/edit-regulation/edit-regulation.component';
import { RegulationServiceService } from '../../regulation-service.service';
import { Router } from '@angular/router';

@Component({
    selector: 'kt-mode-reglement-shell',
    templateUrl: './mode-reglement-shell.component.html'
})
export class ModeReglementShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** the list of regulation mode */
    regulationModes: IPagedResult<IRegulationMode>;

    /** the current regulation mode to modify */
    regulationMode: IRegulationMode;

    /** the form group of regulation mode */
    form: FormGroup;

    /** the filter option */
    filterOption: IFilterOption;

    constructor(
        private fb: FormBuilder,
        protected translate: TranslateService,
        protected toastService: ToastService,
        private translationService: TranslationService,
        private dialogMat: MatDialog,
        private regulationModeService: RegulationServiceService,
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
    initializeForm() {
        this.form = this.fb.group({
            name: [null, Validators.required],
            isModify: [true]
        });
    }

    //#endregion

    //#region services

    /**
     * get regulation mode as page
     */
    getRegulationModes(filterOption: IFilterOption) {
        this.subs.sink = this.regulationModeService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.regulationModes = result;
                    this.filterOption = filterOption;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * add new regulation mode
     */
    addRegulationMode(regulationModeModel: IRegulationModeModel) {
        this.regulationModeService.Add(regulationModeModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.getRegulationModes(this.filterOption);
                this.mode = ModeEnum.List;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * update regulation mode
     */
    updateRegulationMode(regulationModeModel: IRegulationModeModel) {
        this.regulationModeService.Update(this.regulationMode.id, regulationModeModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.getRegulationModes(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete regulation mode
     */
    deleteRegulationMode(id: string) {
        this.regulationModeService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getRegulationModes(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });

    }

    // #endregion

    //#region events

    /**
     * add event
     */
    addEvent() {
        this.regulationMode = null;
        this.initializeForm();
        DialogHelper.openDialog(this.dialogMat, EditRegulationComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addRegulationMode(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(regulationModeModel: IRegulationMode) {
        this.regulationMode = this.regulationModes.value.find(e => e.id === regulationModeModel.id);
        this.initializeForm();
        DialogHelper.openDialog(this.dialogMat, EditRegulationComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            modeReglement: this.regulationMode
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.updateRegulationMode(result);
            }
        });
    }

    //#endregion

}
