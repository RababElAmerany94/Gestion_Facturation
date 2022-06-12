import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { IRegulationMode, IRegulationModeModel } from 'app/core/models/regulation-mode/regulation-mode.model';
import { Observable } from 'rxjs';
import { BaseService } from '../base/base.service';

@Injectable({
  providedIn: 'root'
})
export class RegulationModeService extends BaseService<IRegulationMode, IRegulationModeModel, IRegulationModeModel, string> {

  static endPoint = AppSettings.API_ENDPOINT + 'RegulationModes/';

  constructor(public http: HttpClient) {
    super(http, RegulationModeService.endPoint);
  }

  /**
   * check is unique name
   * @param name the name of the regulation mode to check is unique
   */
  IsUniqueName(name: string): Observable<boolean> {
    return this.http.get<boolean>(RegulationModeService.endPoint + 'IsUnique/' + name);
  }

}
