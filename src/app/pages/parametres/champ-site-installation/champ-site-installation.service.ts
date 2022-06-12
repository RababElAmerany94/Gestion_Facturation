import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult } from 'app/core/models/general/result-model';
import { BaseService } from 'app/core/services/base/base.service';
import { Observable } from 'rxjs';
import { IChampSiteInstallation, IChampSiteInstallationModel } from './champ-site-installation.model';

@Injectable({
    providedIn: 'root'
})
export class ChampSiteInstallationService
    extends BaseService<IChampSiteInstallation, IChampSiteInstallationModel, IChampSiteInstallationModel, string>  {

    private static endPoint = `${AppSettings.API_ENDPOINT}ChampsSiteInstallation/`;

    constructor(protected http: HttpClient) {
        super(http, ChampSiteInstallationService.endPoint);
    }

    /**
     * Check is name is unique
     */
    IsUniqueName(name: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${ChampSiteInstallationService.endPoint}IsUnique/${name}`);
    }

    /**
     * get the list
     */
    GetAll(): Observable<IResult<IChampSiteInstallation[]>> {
        return this.http.get<IResult<IChampSiteInstallation[]>>(`${ChampSiteInstallationService.endPoint}`);
    }

}

