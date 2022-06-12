import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { Memo } from 'app/core/models/general/memo.model';
import { IResult } from 'app/core/models/general/result-model';
import { BaseService } from 'app/core/services/base/base.service';
import { Observable } from 'rxjs';
import { ILoginCreateModel, IUser } from '../users/user.model';
import { IAgence, IAgenceModel, IChangeActivateAgenceModel } from './agence.model';

@Injectable({
    providedIn: 'root'
})
export class AgenceService extends BaseService<IAgence, IAgenceModel, IAgenceModel, string> {

    /**
     * the api end point
     */
    public static endPoint = `${AppSettings.API_ENDPOINT}Agence/`;

    constructor(protected http: HttpClient) {
        super(http, AgenceService.endPoint);
    }

    /**
     * get the list of all Agences
     */
    GetAll(): Observable<IResult<IAgence[]>> {
        return this.http.get<IResult<IAgence[]>>(AgenceService.endPoint);
    }

    /**
     * Save memos of Agence
     * @param id Id of Agence
     * @param name File name of memos
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${AgenceService.endPoint}Memos/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

    /**
     * Get login information of Agence
     * @param id Id of Agence
     */
    GetLogin(id: string): Observable<IResult<IUser>> {
        return this.http.post<IResult<IUser>>(`${AgenceService.endPoint}GetLogin/${id}`, null);
    }

    /**
     * create login for Agence
     * @param body information of login
     */
    CreateLogin(body: ILoginCreateModel): Observable<IResult<IUser>> {
        return this.http.post<IResult<IUser>>(`${AgenceService.endPoint}CreateLogin`, body);
    }

    /**
     * check if the given reference is unique
     * @param reference the reference to be checked
     */
    IsReferenceUnique(reference: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${AgenceService.endPoint}CheckUniqueReference/${reference}`);
    }

    /**
     * change activate agence
     */
    ChangeActivateAgence(body: IChangeActivateAgenceModel): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${AgenceService.endPoint}ChangeActivateAgence`, body);
    }
}
