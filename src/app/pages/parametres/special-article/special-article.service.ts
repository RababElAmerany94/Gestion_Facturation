import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { BaseService } from 'app/core/services/base/base.service';
import { ISpecialArticle, ISpecialArticleModel } from './special-artical.model';
import { Observable } from 'rxjs';
import { IResult } from 'app/core/models/general/result-model';

@Injectable({
    providedIn: 'root'
})
export class SpecialArticleService extends BaseService<ISpecialArticle, ISpecialArticleModel, ISpecialArticleModel, string>{

    static endPoint = AppSettings.API_ENDPOINT + 'SpecialArticle/';

    constructor(protected http: HttpClient) {
        super(http, SpecialArticleService.endPoint);
    }

    /**
     * Check is designation is unique
     * @param designation the designation
     */
    IsUniqueName(designation: string): Observable<IResult<boolean>> {
        return this.http.get<IResult<boolean>>(`${SpecialArticleService.endPoint}IsUnique/${designation}`);
    }
}
