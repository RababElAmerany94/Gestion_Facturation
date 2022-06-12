import { Injectable } from '@angular/core';
import { BaseService } from 'app/core/services/base/base.service';
import { IRegulationModeModel, IRegulationMode } from 'app/core/models/regulation-mode/regulation-mode.model';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class RegulationServiceService extends BaseService<IRegulationMode, IRegulationModeModel, IRegulationModeModel, string> {

    static endPoint = AppSettings.API_ENDPOINT + 'RegulationModes/';

    constructor(protected http: HttpClient) {
        super(http, RegulationServiceService.endPoint);
    }
}
