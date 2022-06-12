import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { BaseService } from 'app/core/services/base/base.service';
import { IFournisseur, IFournisseurModel } from './suppliers';
import { IResult } from 'app/core/models/general/result-model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SuppliersService extends BaseService<IFournisseur, IFournisseurModel, IFournisseurModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}Fournisseurs/`;

    constructor(protected http: HttpClient) {
        super(http, SuppliersService.endPoint);
    }

    /**
     * check if the given reference is unique
     * @param reference the reference to be checked
     */
    IsUniqueReference(reference: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${SuppliersService.endPoint}CheckUniqueReference/${reference}`);
    }
}

