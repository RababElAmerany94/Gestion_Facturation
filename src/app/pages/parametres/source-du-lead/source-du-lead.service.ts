import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult } from 'app/core/models/general/result-model';
import { BaseService } from 'app/core/services/base/base.service';
import { Observable } from 'rxjs';
import { ISourceDuLead, ISourceDuLeadModel } from './source-du-lead';

@Injectable({
    providedIn: 'root'
})
export class SourceDuLeadService extends BaseService<ISourceDuLead, ISourceDuLeadModel, ISourceDuLeadModel, string> {

    static endPoint = AppSettings.API_ENDPOINT + 'SourceDuLead/';

    constructor(protected http: HttpClient) {
        super(http, SourceDuLeadService.endPoint);
    }

    /**
     * Check is name is unique
     * @param name the name
     */
    IsUniqueName(name: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${SourceDuLeadService.endPoint}IsUnique/${name}`);
    }
}
