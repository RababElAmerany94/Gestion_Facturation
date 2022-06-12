import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { DialogHelper } from 'app/core/helpers/dialog';
import { UserHelper } from 'app/core/helpers/user';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { EditPeriodComptableComponent } from '../../components/edit/edit-period-comptable.component';
import { IPeriodeComptable, IPeriodeComptableModel } from '../../period-comptable.model';
import { PeriodComptableService } from '../../period-comptable.service';
import { Router } from '@angular/router';

@Component({
    selector: 'kt-period-comptable-shell',
    templateUrl: './period-comptable-shell.component.html'
})
export class PeriodComptableShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** list of periods comptables */
    periodesComptable: IPagedResult<IPeriodeComptable>;

    /** the current period comptable */
    periodComptable: IPeriodeComptable;

    /** the filter options */

    filterOption: IFilterOption;

    /** the form group */
    form: FormGroup;


    constructor(
        protected translate: TranslateService,
        protected toastService: ToastService,
        private translationService: TranslationService,
        private periodComptableService: PeriodComptableService,
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

    /** init form */
    initForm() {
        this.form = this.fb.group({
            dateDebut: [null, [Validators.required]],
            period: [null, [Validators.required]]
        });
    }
    //#endregion

    //#region service
    /**
     *
     * get period comptable as page
     */
    getPeriodsComptable(filterOption: IFilterOption) {
        this.subs.sink = this.periodComptableService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.filterOption = filterOption;
                    this.periodesComptable = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * add new period comptable
     */
    addPeriodsComptable(periodComptableModel: IPeriodeComptableModel) {
        periodComptableModel.agenceId = UserHelper.getAgenceId();
        this.periodComptableService.Add(periodComptableModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.getPeriodsComptable(this.filterOption);
                this.mode = ModeEnum.List;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * edit period compatable
     */
    editPeriodsComptable(periodComptableModel: IPeriodeComptableModel) {
        this.periodComptableService.Update(this.periodComptable.id, periodComptableModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.getPeriodsComptable(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * cloturer period comptable
     */
    cloturePeriodEvent(id: string) {
        this.subs.sink = this.periodComptableService.closingAccountingPeriod(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.getPeriodsComptable(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    //#endregion

    // #region events

    /**
     * add event
     */
    addEvent() {
        this.periodComptable = null;
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditPeriodComptableComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (result !== null && result !== '') {
                this.addPeriodsComptable(result);
            }
        });
    }

    /**
     * edit event
     */
    editEvent(periodComptable: IPeriodeComptable) {
        this.periodComptable = this.periodesComptable.value.find(e => e.id === periodComptable.id);
        this.initForm();
        DialogHelper.openDialog(this.dialog, EditPeriodComptableComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            periodComptable: this.periodComptable,
        }).subscribe((result) => {
            if (result != null && result !== '') {
                this.editPeriodsComptable(result);
            }
        });
    }

}
