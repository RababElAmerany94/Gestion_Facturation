import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { CopyHelper } from 'app/core/helpers/copy';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { ISourceDuLead, ISourceDuLeadModel } from '../../source-du-lead';
import { SourceDuLeadService } from '../../source-du-lead.service';
import { EditSourceDuLeadComponent } from '../../components/edit-source-du-lead/edit-source-du-lead.component';

@Component({
    selector: 'kt-source-du-lead-shell',
    templateUrl: './source-du-lead-shell.component.html',
})
export class SourceDuLeadShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** list of source du lead */
    sourceDuLeads: IPagedResult<ISourceDuLead>;

    /** the current source du lead */
    sourceDuLead: ISourceDuLead;

    /** the filter option */
    filterOption: IFilterOption;

    /** the form group */
    form: FormGroup;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private sourceDuLeadService: SourceDuLeadService,
        protected toastService: ToastService,
        public dialog: MatDialog,
        private fb: FormBuilder,
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
            name: [null, [Validators.required]],
        });
    }

    //#endregion

    // #region services

    /**
     * get source Du Lead as paged
     */
    getsourceDuLead(filterOption: IFilterOption) {
        this.subs.sink = this.sourceDuLeadService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.filterOption = filterOption;
                this.sourceDuLeads = result;
            });
    }

    /**
     * check username and password are unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(sourceDuLeadModel: ISourceDuLeadModel, isAdd: boolean, callback) {
        this.subs.sink = this.sourceDuLeadService.IsUniqueName(sourceDuLeadModel.name)
            .subscribe((result) => {
                if (
                    result.status === ResultStatus.Succeed &&
                    !result.value &&
                    (isAdd ? true : this.sourceDuLead.name !== sourceDuLeadModel.name)
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
     * add new source Du Lead
     */
    addSourceDuLead(sourceDuLeadModel: ISourceDuLeadModel) {
        this.CheckReferenceIsUnique(sourceDuLeadModel, true, (checkResult) => {
            if (checkResult) {
                this.sourceDuLeadService.Add(sourceDuLeadModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.getsourceDuLead(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit source Du Lead
     */
    editSourceDuLead(sourceDuLead: ISourceDuLeadModel) {
        this.CheckReferenceIsUnique(sourceDuLead, false, (checkResult: boolean) => {
            if (checkResult) {
                this.sourceDuLeadService.Update(this.sourceDuLead.id, sourceDuLead)
                    .subscribe(result => {
                        if (result.status === ResultStatus.Succeed) {
                            this.sourceDuLeads.value[this.getIndexCurrentSourceDuLead()] = result.value;
                            this.sourceDuLeads = CopyHelper.copy(this.sourceDuLeads);
                            this.toastEditSuccess();
                        } else {
                            this.toastErrorServer();
                        }
                    });
            }
        });
    }

    /**
     * delete source Du Lead
     */
    deleteEvent(id: string) {
        this.subs.sink = this.sourceDuLeadService.Delete(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.toastDeleteSuccess();
                    this.getsourceDuLead(this.filterOption);
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
        this.sourceDuLead = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditSourceDuLeadComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.addSourceDuLead(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(sourceDuLead: ISourceDuLead) {
        this.sourceDuLead = this.sourceDuLeads.value.find(e => e.id === sourceDuLead.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditSourceDuLeadComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            sourceDuLead: this.sourceDuLead,
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.editSourceDuLead(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(sourceDuLead: ISourceDuLead) {
        this.sourceDuLead = this.sourceDuLeads.value.find(e => e.id === sourceDuLead.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditSourceDuLeadComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            sourceDuLead: this.sourceDuLead,
            mode: ModeEnum.Show
        });
    }

    // #endregion

    // #region helpers

    /**
     * get index of current source Du Lead
     */
    getIndexCurrentSourceDuLead(): number {
        return this.sourceDuLeads.value.findIndex(e => e.id === this.sourceDuLead.id);
    }

    // #endregion
}
