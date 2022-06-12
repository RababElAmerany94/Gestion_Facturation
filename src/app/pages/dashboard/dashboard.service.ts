import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult } from 'app/core/models/general/result-model';
import {
    IDocumentStatisticByStatus, IChartData, IClassementClient,
    IGetFacturesArticlesByCategory, IGetFacturesArticlesTotals, IGetFacturesArticlesQuantities,
    IVentilationChiffreAffairesCommercial, IRepartitionTypesTravauxParTechnicien, IRepartitionDossiersTechnicien
} from '../dashboard/dashboard.model';
import { IAdvanceDashboardFilterOption, IDashboardFilterOption, IFacturesArticlesByCategoryFilterOption } from 'app/core/models/general/filter-option.model';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    /** dashboard endPoint */
    static endPoint = `${AppSettings.API_ENDPOINT}Dashboard/`;

    constructor(private http: HttpClient) { }

    /** get devis statistic */
    GetDevisStatistic(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<IDocumentStatisticByStatus[]>> {
        return this.http.post<IResult<IDocumentStatisticByStatus[]>>(`${DashboardService.endPoint}DevisStatistic`, dashboardFilterOption);
    }

    /** get facture statistic */
    GetFactureStatistic(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<IDocumentStatisticByStatus[]>> {
        return this.http.post<IResult<IDocumentStatisticByStatus[]>>
            (`${DashboardService.endPoint}FactureStatistic`, dashboardFilterOption);
    }

    /** get dossier statistic */
    GetDossierStatistic(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<IDocumentStatisticByStatus[]>> {
        return this.http.post<IResult<IDocumentStatisticByStatus[]>>
            (`${DashboardService.endPoint}DossierStatistic`, dashboardFilterOption);
    }

    /** get avoir statistic */
    GetAvoirStatistic(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<IDocumentStatisticByStatus[]>> {
        return this.http.post<IResult<IDocumentStatisticByStatus[]>>
            (`${DashboardService.endPoint}AvoirStatistic`, dashboardFilterOption);
    }

    /** get chiffre affaire */
    GetChiffreAffaire(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<IChartData>> {
        return this.http.post<IResult<IChartData>>
            (`${DashboardService.endPoint}ChiffreAffaire`, dashboardFilterOption);
    }

    /** get classsement clietns */
    GetClassementClients(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<IClassementClient[]>> {
        return this.http.post<IResult<IClassementClient[]>>
            (`${DashboardService.endPoint}ClassementClients`, dashboardFilterOption);
    }

    /** get chiffre d'affaire restant à encaisser */
    GetChiffreAffaireRestantAencaisser(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<number>> {
        return this.http.post<IResult<number>>
            (`${DashboardService.endPoint}ChiffreAffaireRestantAencaisser`, dashboardFilterOption);
    }

    /** get articles of factures by category */
    GetFacturesArticlesByCategory(dashboardFilterOption: IFacturesArticlesByCategoryFilterOption)
        : Observable<IResult<IGetFacturesArticlesByCategory[]>> {
        return this.http.post<IResult<IGetFacturesArticlesByCategory[]>>
            (`${DashboardService.endPoint}FacturesArticlesByCategory`, dashboardFilterOption);

    }

    /** get articles of factures with totals */
    GetFacturesArticlesTotals(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<IGetFacturesArticlesTotals[]>> {
        return this.http.post<IResult<IGetFacturesArticlesTotals[]>>
            (`${DashboardService.endPoint}FacturesArticlesTotals`, dashboardFilterOption);

    }

    /** get articles of factures with quantities */
    GetFacturesArticlesQuantities(dashboardFilterOption: IDashboardFilterOption)
        : Observable<IResult<IGetFacturesArticlesQuantities[]>> {
        return this.http.post<IResult<IGetFacturesArticlesQuantities[]>>
            (`${DashboardService.endPoint}FacturesArticlesQuantities`, dashboardFilterOption);

    }

    /** get ventilation chiffre affaires commerciaux */
    GetVentilationChiffreAffairesParCommercial(dashboardFilterOption: IAdvanceDashboardFilterOption)
        : Observable<IResult<IVentilationChiffreAffairesCommercial[]>> {
        return this.http.post<IResult<IVentilationChiffreAffairesCommercial[]>>
            (`${DashboardService.endPoint}GetVentilationChiffreAffairesParCommercial`, dashboardFilterOption);

    }

    /** get repartition types travaux par technicien */
    GetRepartitionTypesTravauxParTechnicien(dashboardFilterOption: IAdvanceDashboardFilterOption)
        : Observable<IResult<IRepartitionTypesTravauxParTechnicien[]>> {
        return this.http.post<IResult<IRepartitionTypesTravauxParTechnicien[]>>
            (`${DashboardService.endPoint}GetRepartitionTypesTravauxParTechnicien`, dashboardFilterOption);

    }

    /** get repartition dossiers par technicien */
    GetRepartitionDossiersTechnicien(dashboardFilterOption: IAdvanceDashboardFilterOption)
        : Observable<IResult<IRepartitionDossiersTechnicien[]>> {
        return this.http.post<IResult<IRepartitionDossiersTechnicien[]>>
            (`${DashboardService.endPoint}GetRepartitionDossiersTechnicien`, dashboardFilterOption);

    }

    /**
     * get the number of folder for dossier
     */
    GetCountDossiers(dashboardFilterOption: IDashboardFilterOption): Observable<IResult<number>> {
        return this.http.post<IResult<number>>(`${DashboardService.endPoint}GetCountDossiers`, dashboardFilterOption);
    }
}
