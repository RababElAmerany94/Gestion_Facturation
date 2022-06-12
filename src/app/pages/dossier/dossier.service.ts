import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResult } from 'app/core/models/general/result-model';
import { CheckUserAssignedSameDateAndHourFilterOption } from '../../core/models/general/filter-option.model';
import { BaseService } from 'app/core/services/base/base.service';
import { IDossier, IDossierModel, IVisteTechnique } from './dossier.model';
import { AppSettings } from 'app/app-settings/app-settings';
import { Memo } from 'app/core/models/general/memo.model';

@Injectable({
    providedIn: 'root'
})
export class DossierService extends BaseService<IDossier, IDossierModel, IDossierModel, string> {

    /**
     * the end point for interacting with the dossier service
     */
    static endPoint = AppSettings.API_ENDPOINT + 'Dossier/';

    constructor(protected http: HttpClient) {
        super(http, DossierService.endPoint);
    }

    /**
     * check if the given reference is unique
     */
    IsUniqueReference(reference: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(DossierService.endPoint + 'CheckUniqueReference/' + reference);
    }

    /**
     * save memo of dossier
     * @param id id of memo
     * @param name name of memo
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${DossierService.endPoint}MemosDossier/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

    /**
     * check user already assigned to another dossier in the same date and hour
     */
    CheckUserAssignedSameDateAndHour(filterOption: CheckUserAssignedSameDateAndHourFilterOption): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${DossierService.endPoint}CheckUserAssignedSameDateAndHour`, filterOption);
    }

    /**
     * synchronize order of antsroute with our dossier
     */
    SynchronizeWithAntsroute(id: string): Observable<IResult<IDossierModel>> {
        return this.http.post<IResult<IDossierModel>>(`${DossierService.endPoint}SynchronizeWithAntsroute/${id}`,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') });
    }

    /**
     * synchronize order of antsroute with our all dossiers
     */
    SynchronizeWithAntsrouteAllDossiers(): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${DossierService.endPoint}SynchronizeWithAntsroute`,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') });
    }

    /**
     * synchronize order of antsroute with our dossier
     */
    MarkDossierAplanifier(id: string): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${DossierService.endPoint}MarkDossierAplanifier/${id}`,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') });
    }

    /**
     * add visite technique with our dossier
     */
    SaveVisteTechnique(id: string, visiteTechnique: IVisteTechnique): Observable<IResult<boolean>> {
        return this.http.post<IResult<boolean>>(`${DossierService.endPoint}VisteTechnique/Save/${id}`, visiteTechnique,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') });
    }

}
