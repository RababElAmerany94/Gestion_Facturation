import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs';
import { AppSettings } from '../../app-settings/app-settings';
import { ILoginModel } from '../models/user/login/login-model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {

    }
    /**
     * Login
     * @param userName the username
     * @param password the password
     */
    login(userName: string, password: string): Observable<ILoginModel> {
        const bodyLogin = { userName, password };
        return this.http.post<ILoginModel>(AppSettings.API_ENDPOINT + 'Account/Login', bodyLogin);
    }

    /**
     * get Token
     */
    getToken() {
        return localStorage.getItem(AppSettings.TOKEN);
    }

    /**
     * get user id
     */
    getIdUser() {
        return localStorage.getItem(AppSettings.USER_ID);
    }

    /**
     * test if user authenticated
     */
    isAuthenticated() {
        const helper = new JwtHelper();
        const token = localStorage.getItem(AppSettings.TOKEN);
        return (token != null && !helper.isTokenExpired(token));
    }

}
