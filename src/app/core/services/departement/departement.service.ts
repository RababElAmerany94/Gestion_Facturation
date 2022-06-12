import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IDepartmentFilterOption } from 'app/core/models/general/filter-option.model';
import { Observable } from 'rxjs';
import { Departement } from 'app/core/models/departement/departement.model';
import { IPagedResult } from 'app/core/models/general/result-model';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  static endPoint = `${AppSettings.API_ENDPOINT}Address/`;

  constructor(private http: HttpClient) { }

  /**
   *  Get departments with pagination
   * @param filterOption the filter options
   */
  GetAsPagedResult(filterOption: IDepartmentFilterOption): Observable<IPagedResult<Departement>> {
    return this.http.post<IPagedResult<Departement>>(`${DepartementService.endPoint}Departements`, filterOption);
  }

  /**
   * Get departement by id
   * @param id id of departement
   */
  Get(id: string): Observable<Departement> {
    return this.http.get<Departement>(`${DepartementService.endPoint}Departement/${id}`);
  }

}
