import { HttpClient } from '@angular/common/http';
import { BaseService } from 'app/core/services/base/base.service';
import { IBankAccount, IBankAccountModel } from './bank-account.model';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';

@Injectable({
    providedIn: 'root'
})
export class BankAccountService extends BaseService<IBankAccount, IBankAccountModel, IBankAccountModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}BankAccounts/`;

    constructor(protected http: HttpClient) {
        super(http, BankAccountService.endPoint);
    }

}
