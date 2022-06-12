import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { IResult } from 'app/core/models/general/result-model';
import { Observable } from 'rxjs';
import { INumeration, INumerationModel } from './numerotation.model';
import { IBodyReferenceDocumentComptable } from 'app/core/models/general/filter-option.model';
import { ReferenceResultModel } from 'app/core/models/general/reference-result-model';

@Injectable({
    providedIn: 'root'
})
export class NumerationService {

    /**
     * the api end point of the numerotation service
     */
    public static endPoint = `${AppSettings.API_ENDPOINT}Numerotation/`;

    constructor(private http: HttpClient) { }

    /**
     * get the numerotation with the given id
     * @param id the id of the numerotation to retrieve
     */
    Get(id: string): Observable<IResult<INumeration>> {
        return this.http.get<IResult<INumeration>>(NumerationService.endPoint + id);
    }

    /**
     * get the list of all numerotation
     */
    GetAll(): Observable<IResult<INumeration[]>> {
        return this.http.get<IResult<INumeration[]>>(NumerationService.endPoint);
    }

    /**
     * add the the given numerotation to the database
     * @param numerotation the numerotation to be added
     */
    AddNumerotation(numerotation: INumerationModel): Observable<IResult<INumeration>> {
        return this.http
            .post<IResult<INumeration>>(NumerationService.endPoint + 'create', numerotation);
    }

    /**
     * update the given numerotation to the database
     * @param idClient the id of the numerotation to be updated
     * @param numerotation the numerotation to be updated
     */
    UpdateNumerotation(numerotationId: string, numerotation: INumerationModel): Observable<IResult<INumeration>> {
        return this.http.put<IResult<INumeration>>(NumerationService.endPoint + 'Update/' + numerotationId, numerotation);
    }

    /**
     * Generate the numerotation with the given id
     * @param type the type of the numerotation to retrieve
     */
    GenerateNumerotation(type: NumerationType): Observable<IResult<INumeration>> {
        return this.http.get<IResult<INumeration>>(NumerationService.endPoint + 'Generate/' + type);
    }

    /**
     * generate reference accounting document
     * @param body the body
     */
    GenerateNumerotationDocumentComptable(body: IBodyReferenceDocumentComptable): Observable<IResult<ReferenceResultModel>> {
        return this.http.post<IResult<ReferenceResultModel>>(`${NumerationService.endPoint}GenerateReferenceDocumentComptable`, body);
    }

}
