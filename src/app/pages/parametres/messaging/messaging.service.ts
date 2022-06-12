import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult } from 'app/core/models/general/result-model';
import { Observable } from 'rxjs';
import { IMessaging, IMessagingModel } from './messaging.model';

@Injectable({
    providedIn: 'root'
})
export class MessagingService {

    static endPoint = `${AppSettings.API_ENDPOINT}ConfigMessagerie/`;

    constructor(private http: HttpClient) { }

    /**
     * get config messaging of current user
     */
    Get(): Observable<IResult<IMessaging>> {
        return this.http.get<IResult<IMessaging>>(MessagingService.endPoint);
    }

    /**
     * add config messaging
     * @param body the body of messaging model
     */
    Add(body: IMessagingModel): Observable<IResult<IMessaging>> {
        return this.http.post<IResult<IMessaging>>(`${MessagingService.endPoint}Create`, body);
    }

    /**
     * update config messaging
     * @param id the id of messaging
     * @param body the body of messaging model
     */
    Update(id: string, body: IMessagingModel): Observable<IResult<IMessaging>> {
        return this.http.put<IResult<IMessaging>>(MessagingService.endPoint + 'Update/' + id, body);
    }

}
