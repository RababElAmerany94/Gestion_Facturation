import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IResult, IPagedResult } from './../../models/general/result-model';
import { AppSettings } from './../../../app-settings/app-settings';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { INotification } from './../../../pages/dashboard/dashboard.model';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    static endPoint = `${AppSettings.API_ENDPOINT}Notifications/`;

    constructor(private http: HttpClient) { }

    /**
     * get all notifications
     * @param filterOption the filter option
     */
    GetAsPagedResult(filterOption: IFilterOption): Observable<IPagedResult<INotification>> {
        return this.http.post<IPagedResult<INotification>>(`${NotificationService.endPoint}`, filterOption);
    }

    /**
     * Seen notification by id
     * @param id the id of the notification
     */
    MarkAsSeen(id: string): Observable<IResult<INotification>> {
        return this.http.get<IResult<INotification>>(`${NotificationService.endPoint}${id}`);
    }

    /**
     * Seen notification by id
     */
    MarkAllAsSeen(): Observable<IResult<INotification>> {
        return this.http.get<IResult<INotification>>(`${NotificationService.endPoint}MarkAllAsSeen`);
    }
}
