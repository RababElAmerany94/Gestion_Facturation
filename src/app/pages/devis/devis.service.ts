import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDevis, IDevisModel } from './devis.model';
import { BaseService } from 'app/core/services/base/base.service';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult } from 'app/core/models/general/result-model';
import { IDocumentParametersModel } from '../parametres/document-parameters/document-parameter.model';
import { IMailHistoryModel, IMailModel } from 'app/core/models/general/mail.model';

@Injectable({
    providedIn: 'root'
})
export class DevisService extends BaseService<IDevis, IDevisModel, IDevisModel, string> {

    /**
     * the end point for interacting with the devis service
     */
    static endPoint = AppSettings.API_ENDPOINT + 'Devis/';

    constructor(protected http: HttpClient) {
        super(http, DevisService.endPoint);
    }

    /**
     * download pdf devis
     * @param id the id of devis
     */
    DownloadPdf(id: string): Observable<IResult<any>> {
        return this.http.get<IResult<any>>(`${DevisService.endPoint}GeneratePDF/${id}`);
    }

    /**
     * check if the given reference is unique
     */
    IsUniqueReference(reference: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(DevisService.endPoint + 'CheckUniqueReference/' + reference);
    }

    /**
     * generate example PDF devis
     * @param body the parameters by default of devis
     */
    ExampleGeneratePDF(body: IDocumentParametersModel): Observable<IResult<any>> {
        return this.http.post<IResult<any>>(`${DevisService.endPoint}ExampleGeneratePDF`, body);
    }

    /**
     * send facture in email
     * @param factureId the id of facture
     * @param body the email information (email to, subject, body)
     */
    SendEmail(factureId: string, body: IMailModel): Observable<IResult<IMailHistoryModel[]>> {
        return this.http.post<IResult<IMailHistoryModel[]>>(`${DevisService.endPoint}SendEmail/${factureId}`, body);
    }
}
