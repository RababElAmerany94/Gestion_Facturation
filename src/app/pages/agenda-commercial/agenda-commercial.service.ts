import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from './../../app-settings/app-settings';
import { BaseService } from 'app/core/services/base/base.service';
import { IEchangeCommercial, IEchangeCommercialModel, IChangeDateEventModel, ICheckRdvIsExistModel } from './agenda-commercial.model';
import { IResultBase, IResult } from './../../core/models/general/result-model';
import { Memo } from 'app/core/models/general/memo.model';

@Injectable({
    providedIn: 'root'
})
export class AgendaCommercialService extends BaseService<IEchangeCommercial, IEchangeCommercialModel, IEchangeCommercialModel, string> {

    /**
     * the end point for interacting with the AgendaCommercial service
     */
    static endPoint = AppSettings.API_ENDPOINT + 'EchangeCommercial/';

    constructor(protected http: HttpClient) {
        super(http, AgendaCommercialService.endPoint);
    }

    /**
     * save memo of Agenda Commercial
     * @param id id of memo
     * @param name name of memo
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${AgendaCommercialService.endPoint}Memos/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

    /**
     * synchronization commercial exchanges with google calendar
     */
    SynchronizationWithGoogleCalendar(): Observable<IResultBase> {
        return this.http.post<IResultBase>(`${AgendaCommercialService.endPoint}SynchronizationWithGoogleCalendar/`,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') });
    }

    /**
     * Update Date Event
     */
    UpdateDateEvent(body: IChangeDateEventModel): Observable<IResult<IChangeDateEventModel>> {
        return this.http.post<IResult<IChangeDateEventModel>>(`${AgendaCommercialService.endPoint}UpdateDateEvent/`, body);
    }

    /**
     * check RDV is exist
     */
    CheckRdvIsExist(body: ICheckRdvIsExistModel): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${AgendaCommercialService.endPoint}CheckRdvIsExist/`, body);
    }
}
