import { IAgendaConfig, IAgendaConfigModel } from './agenda-config.model';
import { Injectable } from '@angular/core';
import { BaseService } from 'app/core/services/base/base.service';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResult } from 'app/core/models/general/result-model';

@Injectable({
    providedIn: 'root'
})
export class AgendaEvenementService extends BaseService<IAgendaConfig, IAgendaConfigModel, IAgendaConfigModel, string> {

    static endPoint = AppSettings.API_ENDPOINT + 'AgendaEvenement/';

    constructor(protected http: HttpClient) {
        super(http, AgendaEvenementService.endPoint);
    }

    /**
     * Check is name is unique
     * @param name the name
     */
    IsUniqueName(name: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${AgendaEvenementService.endPoint}IsUnique/${name}`);
    }
}
