import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { Observable } from 'rxjs';
import { IResult } from '../../core/models/general/result-model';
import { BaseService } from '../../core/services/base/base.service';
import { ISms, ISmsModel, IEnvoyerSmsModel } from './sms.model';

@Injectable({
    providedIn: 'root'
})
export class SmsService extends BaseService<ISms, ISmsModel, ISmsModel, string> {

    /**
     * the end point for interacting with the sms service
     */
    static endPoint = AppSettings.API_ENDPOINT + 'Sms/';

    constructor(protected http: HttpClient) {
        super(http, SmsService.endPoint);
    }

    /**
     * Create sms
     * @param body smsModel
     */
    Send(body: IEnvoyerSmsModel): Observable<IResult<ISmsModel[]>> {
        return this.http.post<IResult<ISmsModel[]>>(`${this.baseUrl}Send`, body);
    }
}
