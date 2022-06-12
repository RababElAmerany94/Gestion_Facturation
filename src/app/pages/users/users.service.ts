import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult, IResultBase, IPagedResult } from 'app/core/models/general/result-model';
import { BaseService } from 'app/core/services/base/base.service';
import { Observable } from 'rxjs';
import { IUser, IUserLiteModel, IUserLogin, IUserModel, ICommercialPlanning, IChangeActivateUserModel } from './user.model';
import { ICommercialPlanningFilterOption } from 'app/core/models/general/filter-option.model';
import { Memo } from 'app/core/models/general/memo.model';

@Injectable({
    providedIn: 'root'
})
export class UsersService extends BaseService<IUser, IUserModel, IUserModel, string> {

    /**
     * the end point for interacting with the Account service
     */
    static endPoint = AppSettings.API_ENDPOINT + 'Account/';

    constructor(protected http: HttpClient) {
        super(http, UsersService.endPoint);
    }

    /**
     * Update password of User
     * update the login info of the given user, the id of the user should be included in the model
     * @param loginModel the login model
     */
    UpdateUserLogin(loginModel: IUserLogin) {
        return this.http.put<IResultBase>(UsersService.endPoint + 'UpdateLogin', loginModel);
    }

    /**
     * update the user password
     * @param id the id of the user
     * @param password the new password
     */
    UpdateUserPassword(id: string, password: string): Observable<IResultBase> {
        return this.http.put<IResultBase>(UsersService.endPoint + 'UpdatePassword', { userId: id, newPassword: password });
    }

    /**
     * Check is username is unique
     * @param username the username
     */
    IsUniqueUsername(username: string): Observable<IResult<boolean>> {
        return this.http.put<IResult<boolean>>(AppSettings.API_ENDPOINT + 'Account/IsUserNameUnique/' + username, null);
    }

    /**
     * Check is matricule is unique
     * @param matricule the username
     */
    isUniqueMatricule(matricule: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(AppSettings.API_ENDPOINT + 'Account/CheckUniqueMatricule/' + matricule);
    }
    /**
     * Get lite information of user by id
     * @param id Id of user
     */
    GetLite(id: string): Observable<IResult<IUserLiteModel>> {
        return this.http.get<IResult<IUserLiteModel>>(AppSettings.API_ENDPOINT + 'Account/Lite/' + id);
    }

    /**
     * Save memos for a commercial exchange
     * @param id Id of the commercial exchange
     * @param name File name of memos
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${UsersService.endPoint}Memos/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

    /**
     * get commercials planning
     * @param filterOptions the filter option
     */
    GetCommercialsPlanning(filterOptions: ICommercialPlanningFilterOption): Observable<IPagedResult<ICommercialPlanning>> {
        return this.http.post<IPagedResult<ICommercialPlanning>>(`${UsersService.endPoint}GetCommercialsPlanning`, filterOptions);
    }

    /**
     * change activate user
     */
    ChangeActivateUser(body: IChangeActivateUserModel): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${UsersService.endPoint}ChangeActivateUser`, body);
    }

    /**
     * Update Google Calendar Id
     */
    UpdateGoogleCalendarId(id: string, googleCalendarId: string): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${UsersService.endPoint}UpdateGoogleCalendarId/${id}/${googleCalendarId}`,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') });
    }
}
