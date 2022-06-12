import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { ISalesJournalFilterOption, IAccountJournalFilterOption } from 'app/core/models/general/filter-option.model';
import { Observable } from 'rxjs';
import { IPagedResult, IResult } from 'app/core/models/general/result-model';
import { ISalesJournalModel, IAccountJournalModel } from './accounting.model';

@Injectable({
    providedIn: 'root'
})
export class AccountingService {
    /**
     * the api end point of the accounting service
     */
    public static endPoint = `${AppSettings.API_ENDPOINT}Comptabilite/`;

    constructor(private http: HttpClient) { }

    /**
     * get the list of sales journal as paged results
     */
    GetSalesJournalAsPagedResult(filterOptions: ISalesJournalFilterOption): Observable<IPagedResult<ISalesJournalModel>> {
        return this.http.post<IPagedResult<ISalesJournalModel>>(`${AccountingService.endPoint}VentesJournal`, filterOptions);
    }

    /**
     * get the list of accounts journal as paged results
     *
     */
    GetAccountsJournalAsPagedResult(filterOptions: IAccountJournalFilterOption): Observable<IPagedResult<IAccountJournalModel>> {
        return this.http.post<IPagedResult<IAccountJournalModel>>(`${AccountingService.endPoint}ComptesJournal`, filterOptions);
    }
    /**
     * Export sales journal format excel
     *
     */
    ExportSalesJournalExcel(filterOptions: ISalesJournalFilterOption): Observable<IResult<any>> {
        return this.http.post<IResult<any>>(`${AccountingService.endPoint}VentesJournal/ExporterExcel`, filterOptions);
    }

    /**
     *  Export accounts journal format excel
     */
    ExportAccountsJournalExcel(filterOptions: IAccountJournalFilterOption): Observable<IResult<any>> {
        return this.http.post<IResult<any>>(`${AccountingService.endPoint}ComptesJournal/ExporterExcel`, filterOptions);
    }

}
