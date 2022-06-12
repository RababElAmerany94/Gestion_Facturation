import { Pipe, PipeTransform } from '@angular/core';
import { IFacturePaiment } from 'app/pages/paiement/paiement.model';

@Pipe({
    name: 'RestPayerFacture',
    pure: false
})
export class RestPayerFacturePipe implements PipeTransform {

    private restPayer = 0;
    private cachedRest = 0;
    private cacheFacturePayment = [];

    constructor() { }

    transform(total: number, facturePayment: IFacturePaiment[]): any {

        if (total == null || facturePayment == null) {
            return 0;
        }

        if (
            total !== this.cachedRest ||
            this.cacheFacturePayment.length !== facturePayment.length ||
            this.cacheFacturePayment.filter(e => facturePayment.filter(c => e.id !== c.id || e.amount !== c.montant)).length > 0
        ) {
            this.restPayer = null;
            this.cachedRest = total;
            this.cacheFacturePayment = facturePayment;
            this.restPayer = total - facturePayment.reduce((x, y) => x + y.montant, 0);
        }

        return this.restPayer;
    }

}
