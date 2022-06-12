import { Component, Input } from '@angular/core';

@Component({
    selector: 'kt-recapitulatif-financier',
    templateUrl: './recapitulatif-financier.component.html'
})
export class RecapitulatifFinancierComponent {

    @Input()
    data: {
        chiffreAffaireRestantAencaisser: number,
        currentBalance: number
    } = {
            chiffreAffaireRestantAencaisser: 0,
            currentBalance: 0
        };


    constructor() { }
}
