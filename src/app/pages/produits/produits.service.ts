import { Injectable } from '@angular/core';
import { BaseService } from 'app/core/services/base/base.service';
import {
    IProduit, IProduitModel, IChangeVisibilityProduitModel, IPrixProduitParAgenceModel, IPrixProduitParAgence
} from './produits.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppSettings } from 'app/app-settings/app-settings';
import { Observable } from 'rxjs';
import { IResult } from 'app/core/models/general/result-model';
import { Memo } from 'app/core/models/general/memo.model';

@Injectable({
    providedIn: 'root'
})
export class ProduitsService extends BaseService<IProduit, IProduitModel, IProduitModel, string> {

    /**
     * the api end point
     */
    public static endPoint = `${AppSettings.API_ENDPOINT}Produit/`;

    constructor(protected http: HttpClient) {
        super(http, ProduitsService.endPoint);
    }

    /**
     * Save memos of produit
     * @param id Id of produit
     * @param name File name of memos
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${ProduitsService.endPoint}Memos/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

    /**
     * check if the given reference is unique
     * @param reference the reference to be checked
     */
    IsReferenceUnique(reference: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${ProduitsService.endPoint}CheckUniqueReference/ ${reference} `);
    }

    /**
     * change visibility produit
     */
    ChangeVisibilityProduit(body: IChangeVisibilityProduitModel): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${ProduitsService.endPoint}ChangeVisibilityProduit`, body);
    }

    /**
     * update information of IPrixProduitParAgence
     */
    UpdatePrixProduitParAgence(id: string, body: IPrixProduitParAgenceModel):
        Observable<IResult<IPrixProduitParAgence>> {
        return this.http.put<IResult<IPrixProduitParAgence>>(`${this.baseUrl}PrixProduitParAgence/Update/${id}`, body);
    }

    /**
     * Create IPrixProduitParAgence
     * @param body TCreateModel
     */
    AddPrixProduitParAgence(body: IPrixProduitParAgenceModel):
        Observable<IResult<IPrixProduitParAgence>> {
        return this.http.post<IResult<IPrixProduitParAgence>>(`${this.baseUrl}PrixProduitParAgence/Create`, body);
    }
}
