import { Injectable } from '@angular/core';
import { BaseService } from 'app/core/services/base/base.service';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { ICategoryDocument, ICategoryDocumentModel } from './category-document.model';
import { Observable } from 'rxjs';
import { IResult } from 'app/core/models/general/result-model';

@Injectable({
  providedIn: 'root'
})
export class CategoryDocumentService extends BaseService<ICategoryDocument, ICategoryDocumentModel, ICategoryDocumentModel, string> {

    static endPoint = AppSettings.API_ENDPOINT + 'CategoryDocuments/';

    constructor(protected http: HttpClient) {
        super(http, CategoryDocumentService.endPoint);
    }

    /**
     * Check is name is unique
     * @param name the name
     */
    IsUniqueName(name: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${CategoryDocumentService.endPoint}IsUnique/${name}`);
    }
}
