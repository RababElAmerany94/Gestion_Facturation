import { Observable } from 'rxjs';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IUniteModel, IUnite } from 'app/core/models/unite/unite.model';
import { BaseService } from 'app/core/services/base/base.service';
import { Injectable } from '@angular/core';
import { IResult } from 'app/core/models/general/result-model';

@Injectable({
    providedIn: 'root'
})
export class TypeChauffageService extends BaseService<IUnite, IUniteModel, IUniteModel, string>  {

    static endPoint = `${AppSettings.API_ENDPOINT}TypeChauffage/`;
    constructor(protected http: HttpClient) {
        super(http, TypeChauffageService.endPoint);

    }
    /**
     * Check is name is unique
     */
    IsUniqueName(name: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${TypeChauffageService.endPoint}IsUnique/${name}`);
    }
}
