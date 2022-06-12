import { Injectable } from '@angular/core';
import { IUniteModel, IUnite } from 'app/core/models/unite/unite.model';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { AppSettings } from 'app/app-settings/app-settings';

@Injectable({
  providedIn: 'root'
})
export class UniteService extends BaseService<IUnite, IUniteModel, IUniteModel, string> {

  static endPoint = AppSettings.API_ENDPOINT + 'Unite/';

  constructor(protected http: HttpClient) {
    super(http, UniteService.endPoint);
  }
}
