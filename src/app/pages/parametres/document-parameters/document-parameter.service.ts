import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IDocumentParametersModel, IDocumentParameters } from './document-parameter.model';
import { Observable } from 'rxjs';
import { IResult } from 'app/core/models/general/result-model';

@Injectable({
    providedIn: 'root'
})
export class DocumentParameterService {

    static endPoint = `${AppSettings.API_ENDPOINT}DocumentParameters/`;

    constructor(private http: HttpClient) { }

    /**
     * add document parameter
     */
    Add(body: IDocumentParametersModel): Observable<IResult<IDocumentParameters>> {
        return this.http.post<IResult<IDocumentParameters>>(DocumentParameterService.endPoint + 'Create', body);
    }

    /**
     * update document parameter
     */
    Update(documentParamtersId: string, body: IDocumentParametersModel): Observable<IResult<IDocumentParameters>> {
        return this.http.put<IResult<IDocumentParameters>>(DocumentParameterService.endPoint + 'Update/' + documentParamtersId, body);
    }

    /**
     * get document params
     */
    Get(): Observable<IResult<IDocumentParameters>> {
        return this.http.get<IResult<IDocumentParameters>>(DocumentParameterService.endPoint);
    }

}
