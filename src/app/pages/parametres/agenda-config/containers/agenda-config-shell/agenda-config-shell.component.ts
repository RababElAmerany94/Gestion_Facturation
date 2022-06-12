import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslationService } from 'app/core/layout';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IAgendaEvenementFilterOption } from 'app/core/models/general/filter-option.model';
import { ToastService } from 'app/core/layout/services/toast.service';
import { ResultStatus } from 'app/core/enums/result-status';
import { CopyHelper } from 'app/core/helpers/copy';
import { DialogHelper } from 'app/core/helpers/dialog';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { StringHelper } from 'app/core/helpers/string';
import { EditAgendaConfigComponent } from './../../components/edit-agenda-config/edit-agenda-config.component';
import { IAgendaConfig, IAgendaConfigModel } from './../../agenda-config.model';
import { AgendaEvenementService } from '../../agenda.evenement.service';
import { AgendaType } from 'app/core/enums/agenda-type.enum';

@Component({
    selector: 'kt-agenda-config-shell',
    templateUrl: './agenda-config-shell.component.html'
})
export class AgendaConfigShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** list of Type Tache */
    agendaConfigs: IPagedResult<IAgendaConfig>;

    /** the current Type Tache */
    agendaConfig: IAgendaConfig;

    /** the filter option */
    filterOption: IAgendaEvenementFilterOption;

    /** the form group */
    form: FormGroup;

    /** selected tabs */
    selectedTabs = AgendaType.TacheType;

    /** selected tabs type */
    selectedTabsTpe = AgendaType

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private agendaEvenementService: AgendaEvenementService,
        protected toastService: ToastService,
        public dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.AgendaParametrage);
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

    // #region services agenda Evenement

    /**
     * get agenda Evenement as paged
     */
    getAgendaEvenement(filterOption: IAgendaEvenementFilterOption) {
        filterOption.type = this.getTypeTabs();
        this.subs.sink = this.agendaEvenementService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.filterOption = filterOption;
                this.agendaConfigs = result;
            });
    }

    /**
     * check name is unique
     * @param callback the callback
     */
    CheckNameIsUniqueAgendaEvenement(agendaConfigModel: IAgendaConfigModel, isAdd: boolean, callback) {
        this.subs.sink = this.agendaEvenementService.IsUniqueName(agendaConfigModel.name)
            .subscribe((result) => {
                if (
                    result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.agendaConfig.name !== agendaConfigModel.name)
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
     * add new agenda Evenement
     */
    addAgendaEvenement(agendaConfigModel: IAgendaConfigModel) {
        this.CheckNameIsUniqueAgendaEvenement(agendaConfigModel, true, (checkResult) => {
            if (checkResult) {
                this.agendaEvenementService.Add(agendaConfigModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getAgendaEvenement(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit agenda Evenement
     */
    editAgendaEvenement(agendaConfig: IAgendaConfigModel) {
        this.CheckNameIsUniqueAgendaEvenement(agendaConfig, false, (checkResult: boolean) => {
            if (checkResult) {
                this.agendaEvenementService.Update(this.agendaConfig.id, agendaConfig)
                    .subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.agendaConfigs.value[this.getIndexCurrentAgendaConfig()] = result.value;
                            this.agendaConfigs = CopyHelper.copy(this.agendaConfigs);
                            this.toastEditSuccess();
                        } else {
                            this.toastErrorServer();
                        }
                    });
            }
        });
    }

    /**
     * delete Agenda Evenement
     */
    deleteAgendaEvenement(id: string) {
        this.subs.sink = this.agendaEvenementService.Delete(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.toastDeleteSuccess();
                    this.getAgendaEvenement(this.filterOption);
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
        this.agendaConfig = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditAgendaConfigComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add,
            typeTabs: this.selectedTabs,
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                result.type = this.getTypeTabs();
                this.addAgendaEvenement(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(agendaConfig: IAgendaConfig) {
        this.agendaConfig = this.agendaConfigs.value.find(e => e.id === agendaConfig.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditAgendaConfigComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            typeTabs: this.selectedTabs,
            agendaConfig: this.agendaConfig,
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                result.type = this.getTypeTabs();
                this.editAgendaEvenement(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(agendaConfig: IAgendaConfig) {
        this.agendaConfig = this.agendaConfigs.value.find(e => e.id === agendaConfig.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditAgendaConfigComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Show,
            typeTabs: this.selectedTabs,
            agendaConfig: this.agendaConfig,
        });
    }

    // #endregion

    // #region helpers

    /**
     * get index of current Type Tache
     */
    getIndexCurrentAgendaConfig(): number {
        return this.agendaConfigs.value.findIndex(e => e.id === this.agendaConfig.id);
    }

    /**
     * get type of tabs and synchronize with type backend
     */
    getTypeTabs() {
        switch (this.selectedTabs) {
            case AgendaType.AppelType:
                return AgendaType.AppelType;

            case AgendaType.RdvType:
                return AgendaType.RdvType;

            case AgendaType.TacheType:
                return AgendaType.TacheType;

            case AgendaType.SourceRDV:
                return AgendaType.SourceRDV;

            case AgendaType.EvenementCategorie:
                return AgendaType.EvenementCategorie;
        }
    }

    // #endregion

}
