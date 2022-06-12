import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { BaseService } from 'app/core/services/base/base.service';
import { Observable } from 'rxjs';
import { IFacture, IFactureModel } from './facture.model';
import { IResult } from 'app/core/models/general/result-model';
import { IMailHistoryModel, IMailModel } from 'app/core/models/general/mail.model';
import { IDocumentParametersModel } from '../parametres/document-parameters/document-parameter.model';
import { IReleveFacturesFilterOption } from 'app/core/models/general/filter-option.model';
import { Memo } from 'app/core/models/general/memo.model';

@Injectable({
    providedIn: 'root'
})
export class FactureService extends BaseService<IFacture, IFactureModel, IFactureModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}Facture/`;

    constructor(protected http: HttpClient) {
        super(http, FactureService.endPoint);
    }

    /**
     * Save memos of facture
     * @param id Id of facture
     * @param name File name of memos
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${FactureService.endPoint}Memos/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

    /**
     * generate PDF
     * @param id the id of facture
     */
    GeneratePDF(id: string): Observable<IResult<any>> {
        return this.http.get<IResult<any>>(`${FactureService.endPoint}GeneratePDF/${id}`);
    }

    /**
     * send facture in email
     * @param factureId the id of facture
     * @param body the email information (email to, subject, body)
     */
    SendEmail(factureId: string, body: IMailModel): Observable<IResult<IMailHistoryModel[]>> {
        return this.http.post<IResult<IMailHistoryModel[]>>(`${FactureService.endPoint}SendEmail/${factureId}`, body);
    }

    /**
     * cancel facture
     * @param factureId the id of facture
     */
    CancelFacture(factureId: string): Observable<IResult<IFacture>> {
        return this.http.get<IResult<IFacture>>(`${FactureService.endPoint}Cancel/${factureId}`);
    }

    /**
     * generate example PDF facture
     * @param body the parameters by default of facture
     */
    ExampleGeneratePDF(body: IDocumentParametersModel): Observable<IResult<any>> {
        return this.http.post<IResult<any>>(`${FactureService.endPoint}ExampleGeneratePDF`, body);
    }

    /**
     * export releve facture
     * @param body export releve facture by filter
     */
    ExportReleveFacturesPDF(body: IReleveFacturesFilterOption): Observable<IResult<any>> {
        return this.http.post<IResult<any>>(`${FactureService.endPoint}ExportReleveFacturesPDF`, body);
    }
}
