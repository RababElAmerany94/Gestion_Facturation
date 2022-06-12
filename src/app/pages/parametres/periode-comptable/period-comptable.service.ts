import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'app/core/services/base/base.service';
import { IPeriodeComptable, IPeriodeComptableModel } from './period-comptable.model';
import { Observable } from 'rxjs';
import { IResultBase } from 'app/core/models/general/result-model';

@Injectable({
    providedIn: 'root'
})
export class PeriodComptableService extends BaseService<IPeriodeComptable, IPeriodeComptableModel, IPeriodeComptableModel, string> {

    /**
     * the api end point of period Compatble
     */
    public static endPoint = `${AppSettings.API_ENDPOINT}PeriodeComptable/`;
    constructor(protected http: HttpClient) {
        super(http, PeriodComptableService.endPoint);
    }

    /**
     * closing accounting period
     *
     */
    closingAccountingPeriod(id: string): Observable<IResultBase> {
        return this.http.get<IResultBase>(`${PeriodComptableService.endPoint}ClosingPeriodeComptable/${id}`);
    }
}
