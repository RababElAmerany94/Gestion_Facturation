import { IResult } from './../../../core/models/general/result-model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { BaseService } from 'app/core/services/base/base.service';
import { IModeleSMS, IModeleSMSModel } from './modele-sms.model';

@Injectable({
    providedIn: 'root'
})
export class ModeleSMSService extends BaseService<IModeleSMS, IModeleSMSModel, IModeleSMSModel, string>  {

    static endPoint = `${AppSettings.API_ENDPOINT}ModeleSms/`;
    constructor(protected http: HttpClient) {
        super(http, ModeleSMSService.endPoint);
    }

    /**
     * Check is name is unique
     * @param name the name
     */
    IsUniqueName(name: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${ModeleSMSService.endPoint}IsUnique/${name}`);
    }
}
