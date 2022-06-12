import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppSettings } from 'app/app-settings/app-settings';
import { HttpClient } from '@angular/common/http';
import { IResult } from 'app/core/models/general/result-model';
import { IPaimentFilterOption } from 'app/core/models/general/filter-option.model';
import { BaseService } from 'app/core/services/base/base.service';
import { IPaiement, IPaiementModel, IPaiementGroupeObligeModel } from './paiement.model';

@Injectable({
    providedIn: 'root'
})
export class PaiementService extends BaseService<IPaiement, IPaiementModel, IPaiementModel, string> {

    static endPoint = `${AppSettings.API_ENDPOINT}Paiement/`;

    constructor(protected http: HttpClient) {
        super(http, PaiementService.endPoint);
    }
  /**
   * movement amount from account to account
   * @param accountDebitId the id of debit account
   * @param creditAccountId the id of credit account
   * @param amount the amount want to move
   */
    MovementCompteToCompte(body: { compteDebitId: string, creditAccountId: string, montant: number, description: string }) {
        return this.http.post<IResult<boolean>>(`${PaiementService.endPoint}MovementCompteToCompte`, body);
    }

    /**
     * get current balance
     * @param paymentFilter the filter option
     */
    GetTotalPayments(paymentFilter: IPaimentFilterOption): Observable<IResult<number>> {
        return this.http.post<IResult<number>>(`${PaiementService.endPoint}GetTotalPaiments`, paymentFilter);
    }

    /**
     * get payment
     * @param paymentOblige the payment of oblige
     */
    PaiementGroupeOblige(paymentOblige: IPaiementGroupeObligeModel): Observable<IResult<number>> {
        return this.http.post<IResult<number>>(`${PaiementService.endPoint}PaiementGroupeOblige`, paymentOblige);
    }
}
