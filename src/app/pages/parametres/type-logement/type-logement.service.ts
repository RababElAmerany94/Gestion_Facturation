import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult } from 'app/core/models/general/result-model';
import { Observable } from 'rxjs';
import { BaseService } from 'app/core/services/base/base.service';
import { ITypeLogement, ITypeLogementModel } from './type-logement.model';

@Injectable({
    providedIn: 'root'
})
export class TypeLogementService extends BaseService<ITypeLogement, ITypeLogementModel, ITypeLogementModel, string> {

    static endPoint = AppSettings.API_ENDPOINT + 'LogementType/';

    constructor(protected http: HttpClient) {
        super(http, TypeLogementService.endPoint);
    }

    /**
     * Check is name is unique
     * @param name the name
     */
    IsUniqueName(name: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${TypeLogementService.endPoint}IsUnique/${name}`);
    }
}
