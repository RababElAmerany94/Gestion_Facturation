import { Injectable } from '@angular/core';
import { BaseService } from 'app/core/services/base/base.service';
import { IAvoir, IAvoirModel } from './avoir.model';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IResult } from 'app/core/models/general/result-model';
import { IDocumentParametersModel } from '../parametres/document-parameters/document-parameter.model';
import { IMailHistoryModel, IMailModel } from 'app/core/models/general/mail.model';
import { Memo } from 'app/core/models/general/memo.model';


@Injectable({
    providedIn: 'root'
})
export class AvoirService extends BaseService<IAvoir, IAvoirModel, IAvoirModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}Avoir/`;

    constructor(protected http: HttpClient) {
        super(http, AvoirService.endPoint);
    }

    /**
     * Save memos of avoir
     * @param id Id of avoir
     * @param name File name of memos
     */
    SaveMemos(id: string, name: Memo[]): Observable<any> {
        return this.http.post<any>(`${AvoirService.endPoint}Memos/Save/${id}`, name,
            { headers: new HttpHeaders().append('Content-Type', 'application/json') }
        );
    }

    /**
     * generate PDF
     * @param id the id of avoir
     */
    GeneratePDF(id: string): Observable<IResult<any>> {
        return this.http.get<IResult<any>>(`${AvoirService.endPoint}GeneratePDF/${id}`);
    }

    /**
     * generate example PDF avoir
     * @param body the parameters by default of avoir
     */
    ExampleGeneratePDF(body: IDocumentParametersModel): Observable<IResult<any>> {
        return this.http.post<IResult<any>>(`${AvoirService.endPoint}ExampleGeneratePDF`, body);
    }

    /**
     * send avoir in email
     * @param avoirId the id of avoir
     * @param body the email information (email to, subject, body)
     */
    SendEmail(avoirId: string, body: IMailModel): Observable<IResult<IMailHistoryModel[]>> {
        return this.http.post<IResult<IMailHistoryModel[]>>(`${AvoirService.endPoint}SendEmail/${avoirId}`, body);
    }
}
