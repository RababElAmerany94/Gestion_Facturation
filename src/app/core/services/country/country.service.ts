import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { Observable } from 'rxjs';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { Country } from 'app/core/models/country/country.model';
import { IPagedResult } from 'app/core/models/general/result-model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  static endPoint = `${AppSettings.API_ENDPOINT}Address/`;

  constructor(private http: HttpClient) { }

  /**
   * get all countries
   * @param filterOption the filter option
   */
  GetAsPagedResult(filterOption: IFilterOption): Observable<IPagedResult<Country>> {
    return this.http.post<IPagedResult<Country>>(`${CountryService.endPoint}Countries`, filterOption);
  }

  /**
   * get country by id
   * @param id the id of the country
   */
  Get(id: string): Observable<Country> {
    return this.http.get<Country>(`${CountryService.endPoint}Country/${id}`);
  }

}
