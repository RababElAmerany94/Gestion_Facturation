import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PeriodeComptableFilter } from 'app/core/enums/periode-comptable.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { DateHelper } from 'app/core/helpers/date';
import { UserHelper } from 'app/core/helpers/user';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IAdvanceDashboardFilterOption, IDashboardFilterOption, IFacturesArticlesByCategoryFilterOption } from 'app/core/models/general/filter-option.model';
import { AgendaCommercialService } from 'app/pages/agenda-commercial/agenda-commercial.service';
import { DossierService } from 'app/pages/dossier/dossier.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import {
    IGetFacturesArticlesByCategory, IRepartitionDossiersTechnicien,
    IRepartitionTypesTravauxParTechnicien, IVentilationChiffreAffairesCommercial
} from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';

@Component({
    selector: 'kt-suivi-activite',
    templateUrl: './suivi-activite.component.html'
})
export class SuiviActiviteComponent extends BaseContainerTemplateComponent implements OnInit {

    form: FormGroup;

    /** the roleId of user */
    userProfile = UserProfile;

    facturesArticlesByCategory: IGetFacturesArticlesByCategory[] = []

    ventilationChiffreAffairesCommercial: IVentilationChiffreAffairesCommercial[] = [];
    repartitionTypesTravauxParTechnicien: IRepartitionTypesTravauxParTechnicien[] = [];
    repartitionDossiersTechnicien: IRepartitionDossiersTechnicien[] = [];

    dashboardFilterOption: IDashboardFilterOption = {
        dateTo: DateHelper.formatDateTime(DateHelper.getLastDayInTheCurrentYear()),
        dateFrom: DateHelper.formatDateTime(DateHelper.getFirstDayInTheCurrentYear()),
        period: PeriodeComptableFilter.Interval,
    };

    advanceDashboardFilterOption: IAdvanceDashboardFilterOption = {
        ...this.dashboardFilterOption,
    };

    facturesArticlesByCategoryFilterOption: IFacturesArticlesByCategoryFilterOption = {
        ...this.advanceDashboardFilterOption,
        categoryId: null,
    };

    /** period comptable */
    PeriodeComptable: IDropDownItem<number, string>[] = [];

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private dashboardService: DashboardService,
        private fb: FormBuilder,
        protected toastService: ToastService,
        protected agendaCommercialService: AgendaCommercialService,
        protected dossierService: DossierService,
        protected router: Router,
    ) {
        super(translate, toastService, router);
        this.initializeForm();
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
        this.initDataComponent();
        this.chargeAccountingPeriod();
    }

    /**
     * search form initialization
     */
    initializeForm() {
        this.form = this.fb.group({
            period: [PeriodeComptableFilter.Interval],
            userId: [null],
            categoryId: [null],
            agenceId: [null],
            dateFrom: [new Date(DateHelper.getFirstDayInTheCurrentYear())],
            dateTo: [new Date(DateHelper.getLastDayInTheCurrentYear())]
        });
    }

    /** init data component */
    initDataComponent() {
        this.getVentilationChiffreAffairesParCommercial();
        this.GetRepartitionDossiersTechnicien();
        this.GetRepartitionTypesTravauxParTechnicien();
        this.getFacturesArticlesByCategory();
    }


    search() {
        const values = this.form.value;
        this.advanceDashboardFilterOption = {
            dateFrom: values?.dateFrom != null ? values?.dateFrom : DateHelper.getFirstDayInTheCurrentYear(),
            dateTo: values?.dateTo != null ? values?.dateTo : DateHelper.getLastDayInTheCurrentYear(),
            userId: values?.userId,
            agenceId: values?.agenceId != null ? values?.agenceId : UserHelper.getAgenceId(),
            period: values?.period != null ? values?.period : PeriodeComptableFilter.Interval,
        };
        this.facturesArticlesByCategoryFilterOption = {
            ...this.advanceDashboardFilterOption,
            categoryId: values?.categoryId,
        };
        this.initDataComponent();
    }
    //#region service

    /** get ventilation chiffre affaires commerciaux */
    getVentilationChiffreAffairesParCommercial() {
        this.subs.sink = this.dashboardService.GetVentilationChiffreAffairesParCommercial(this.advanceDashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.ventilationChiffreAffairesCommercial = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /** get repartition types travaux par technicien */
    GetRepartitionTypesTravauxParTechnicien() {
        this.subs.sink = this.dashboardService.GetRepartitionTypesTravauxParTechnicien(this.advanceDashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.repartitionTypesTravauxParTechnicien = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /** get repartition dossiers par technicien */
    GetRepartitionDossiersTechnicien() {
        this.subs.sink = this.dashboardService.GetRepartitionDossiersTechnicien(this.advanceDashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.repartitionDossiersTechnicien = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get Factures Articles By Category
     */
    getFacturesArticlesByCategory() {
        this.subs.sink = this.dashboardService.GetFacturesArticlesByCategory(this.facturesArticlesByCategoryFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.facturesArticlesByCategory = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    //#endregion

    //#region helpers

    /** period comptable enum  */
    chargeAccountingPeriod() {
        this.PeriodeComptable = ConversionHelper.convertEnumToListKeysValues(PeriodeComptableFilter, 'number');
        this.PeriodeComptable.forEach(e => e.text = `PERIOD_COMPTABLE.${e.value}`);
    }

    //#endregion
}
