import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { PeriodeComptableFilter } from 'app/core/enums/periode-comptable.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { DateHelper } from 'app/core/helpers/date';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IDashboardFilterOption, IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { NotificationService } from 'app/core/services/notification/notification.service';
import { IEchangeCommercial } from 'app/pages/agenda-commercial/agenda-commercial.model';
import { AgendaCommercialService } from 'app/pages/agenda-commercial/agenda-commercial.service';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { DossierService } from 'app/pages/dossier/dossier.service';
import { PaiementService } from 'app/pages/paiement/paiement.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import {
    IChartData, IDocumentStatisticByStatus, INotification,
    InputClassementDashboard
} from '../../dashboard.model';
import { DashboardService } from '../../dashboard.service';


@Component({
    selector: 'kt-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent extends BaseContainerTemplateComponent implements OnInit {

    notifications: IPagedResult<INotification>;
    echangeCommercial: IPagedResult<IEchangeCommercial>;
    dossiers: IPagedResult<IDossier>;
    chiffreAffaireStatistics: IChartData;

    statisticDocuments: {
        devis: IDocumentStatisticByStatus[],
        dossier: IDocumentStatisticByStatus[],
        facture: IDocumentStatisticByStatus[],
        avoir: IDocumentStatisticByStatus[]
    } = {
            devis: [],
            dossier: [],
            facture: [],
            avoir: []
        };

    classementData: InputClassementDashboard = {
        classementClient: [],
        facturesArticlesByCategory: [],
        facturesArticlesQuantities: [] = [],
        facturesArticlesTotals: [] = []
    };

    numberDocuments = {
        avoir: 0,
        dossier: 0,
        facture: 0,
        devis: 0
    }

    recapitulatifFinancier: {
        chiffreAffaireRestantAencaisser: number,
        currentBalance: number
    } = {
            chiffreAffaireRestantAencaisser: 0,
            currentBalance: 0
        }

    notificationFilterOption: IFilterOption = {
        OrderBy: 'createOn',
        SortDirection: SortDirection.Desc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    filterOption: IFilterOption = {
        OrderBy: 'createOn',
        SortDirection: SortDirection.Desc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    dashboardFilterOption: IDashboardFilterOption = {
        dateTo: DateHelper.formatDateTime(DateHelper.getLastDayInTheCurrentYear()),
        dateFrom: DateHelper.formatDateTime(DateHelper.getFirstDayInTheCurrentYear()),
        period: PeriodeComptableFilter.All,
    };

    constructor(
        private notificationService: NotificationService,
        protected translate: TranslateService,
        private translationService: TranslationService,
        private dashboardService: DashboardService,
        private paiementService: PaiementService,
        protected toastService: ToastService,
        protected agendaCommercialService: AgendaCommercialService,
        protected dossierService: DossierService,
        protected router: Router,
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Home);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    /** init data component */
    initDataComponent() {
        this.getDevisStatistic();
        this.getFactureStatistic();
        this.getDossierStatistic();
        this.getAvoirStatistic();
        this.GetChiffreAffaire();
        this.getChiffreAffaireRestantAencaisser();
        this.getCurrentBalance();
        this.getClassementClients();
        this.getFacturesArticlesByCategory();
        this.getFacturesArticlesQuantities();
        this.getFacturesArticlesTotals();
        this.getNotifications();
        this.getEchangeCommercial();
        this.getDossiers();
    }

    //#region services

    /**
     * get chiffre affaire
     */
    GetChiffreAffaire() {
        this.subs.sink = this.dashboardService.GetChiffreAffaire(this.dashboardFilterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.chiffreAffaireStatistics = result.value;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get nombre devis
     */
    getDevisStatistic() {
        this.subs.sink = this.dashboardService.GetDevisStatistic(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.statisticDocuments.devis = result.value;
                    this.numberDocuments.devis = this.sumCountDocumentStatistic(result.value);
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get nombre devis
     */
    getFactureStatistic() {
        this.subs.sink = this.dashboardService.GetFactureStatistic(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.statisticDocuments.facture = result.value;
                    this.numberDocuments.facture = this.sumCountDocumentStatistic(result.value);
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get nombre devis
     */
    getDossierStatistic() {
        this.subs.sink = this.dashboardService.GetDossierStatistic(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.statisticDocuments.dossier = result.value;
                    this.numberDocuments.dossier = this.sumCountDocumentStatistic(result.value);
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get nombre devis
     */
    getAvoirStatistic() {
        this.subs.sink = this.dashboardService.GetAvoirStatistic(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.statisticDocuments.avoir = result.value;
                    this.numberDocuments.avoir = this.sumCountDocumentStatistic(result.value);
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get Chiffre Affaire Restant A encaisser
     */
    getChiffreAffaireRestantAencaisser() {
        this.subs.sink = this.dashboardService.GetChiffreAffaireRestantAencaisser(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.recapitulatifFinancier.chiffreAffaireRestantAencaisser = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get current balance
     */
    getCurrentBalance() {
        this.subs.sink = this.paiementService.GetTotalPayments(this.notificationFilterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.recapitulatifFinancier.currentBalance = result.value;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get classement client
     */
    getClassementClients() {
        this.subs.sink = this.dashboardService.GetClassementClients(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.classementData.classementClient = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get Factures Articles By Category
     */
    getFacturesArticlesByCategory() {
        this.subs.sink = this.dashboardService.GetFacturesArticlesByCategory(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.classementData.facturesArticlesByCategory = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get Factures Articles total
     */
    getFacturesArticlesTotals() {
        this.loading = true;
        this.subs.sink = this.dashboardService.GetFacturesArticlesTotals(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.classementData.facturesArticlesTotals = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get Factures Articles quantite
     */
    getFacturesArticlesQuantities() {
        this.subs.sink = this.dashboardService.GetFacturesArticlesQuantities(this.dashboardFilterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.classementData.facturesArticlesQuantities = result.value;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get notifications as paged
     */
    getNotifications() {
        this.subs.sink = this.notificationService.GetAsPagedResult(this.notificationFilterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.notifications = result;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /** view notification */
    seenNotification(notification: INotification) {
        this.subs.sink = this.notificationService.MarkAsSeen(notification.id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.getNotifications();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /** mark all view notification */
    markAllAsSeenNotification() {
        this.subs.sink = this.notificationService.MarkAllAsSeen().subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.getNotifications();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get notifications as paged
     */
    getEchangeCommercial() {
        this.agendaCommercialService.GetAsPagedResult(this.filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.echangeCommercial = result;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get dossiers as paged
     */
    getDossiers() {
        this.dossierService.GetAsPagedResult(this.filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.dossiers = result;
            } else {
                this.toastErrorServer();
            }
        });
    }

    //#endregion

    //#region helpers

    sumCountDocumentStatistic(list: IDocumentStatisticByStatus[]): number {
        return list.reduce((previous, current) => previous + current.count, 0);
    }

    changeEventEchangeCommercial(event: any) {
        this.filterOption.Page = event.pageIndex + 1;
        this.filterOption.PageSize = event.pageSize;
        this.getEchangeCommercial();
    }

    changeEventDossiers(event: any) {
        this.filterOption.Page = event.pageIndex + 1;
        this.filterOption.PageSize = event.pageSize;
        this.getDossiers();
    }

    changeEventNotification(event: { page: number, pageSize: number }) {
        this.notificationFilterOption.Page = event.page;
        this.notificationFilterOption.PageSize = event.pageSize;
        this.getNotifications();
    }

    //  this.initDataComponent(); / dashboardFilterOption

    //#endregion

}
