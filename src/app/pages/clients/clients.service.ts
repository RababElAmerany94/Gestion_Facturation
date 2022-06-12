import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginCreateModel, IUser } from '../users/user.model';
import { IClient, IClientModel } from './client.model';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult } from 'app/core/models/general/result-model';
import { BaseService } from 'app/core/services/base/base.service';
import { Memo } from 'app/core/models/general/memo.model';

@Injectable({
    providedIn: 'root'
})
export class ClientsService extends BaseService<IClient, IClientModel, IClientModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}Clients/`;

    constructor(protected http: HttpClient) {
        super(http, ClientsService.endPoint);
    }

    /**
     * check if the given reference is unique
     */
    IsUniqueReference(reference: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(ClientsService.endPoint + 'CheckUniqueReference/' + reference);
    }

    /**
     * check if the given phone number is unique
     */
    IsUniquePhone(phone: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(ClientsService.endPoint + 'CheckUniquePhone/' + phone);
    }

    /**
     * client login fo client
     */
    CreateClientLogin(body: ILoginCreateModel): Observable<IResult<IUser>> {
        return this.http.post<IResult<IUser>>(ClientsService.endPoint + 'CreateLogin', body);
    }

    /**
     * save memo of client
     * @param id id of memo
     * @param name name of memo
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${ClientsService.endPoint}Memos/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

}
