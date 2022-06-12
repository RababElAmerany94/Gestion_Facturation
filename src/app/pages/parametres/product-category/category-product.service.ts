import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IResult } from 'app/core/models/general/result-model';
import { ICategoryProduct, ICategoryProductModel } from 'app/pages/parametres/product-category/category-product.model';
import { Observable } from 'rxjs';
import { BaseService } from 'app/core/services/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryProductService extends BaseService<ICategoryProduct, ICategoryProductModel, ICategoryProductModel, string> {

  static endPoint = AppSettings.API_ENDPOINT + 'CategoryProducts/';

  constructor(protected http: HttpClient) {
    super(http, CategoryProductService.endPoint);
  }

  /**
   * Check is name is unique
   * @param name the name
   */
  IsUniqueName(name: string): Observable<IResult<boolean>> {
    return this.http.get<IResult<boolean>>(`${CategoryProductService.endPoint}IsUnique/${name}`);
  }
}
