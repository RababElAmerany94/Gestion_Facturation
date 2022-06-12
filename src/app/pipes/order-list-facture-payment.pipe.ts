import { Pipe, PipeTransform } from '@angular/core';
import { IFacture } from 'app/pages/facture/facture.model';

@Pipe({
    name: 'OrderListFacturePayment',
    pure: false
})
export class OrderListFacturePaymentPipe implements PipeTransform {

    private cachedList = [];

    constructor() { }

    transform(list: IFacture[], args?): any {

        if (list == null) {
            return [];
        }

        // tslint:disable-next-line:only-arrow-functions
        list.sort(function(a, b) {
            if (a.dateEcheance > b.dateEcheance) { return 1; }
            if (a.dateEcheance < b.dateEcheance) { return -1; }
            return 0;
        });

        return list;
    }

}
