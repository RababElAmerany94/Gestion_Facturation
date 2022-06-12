import { Component, Input } from '@angular/core';

@Component({
    selector: 'kt-signature-devis',
    templateUrl: './signature-devis.component.html'
})
export class SignatureDevisComponent {

    @Input()
    nameClientSignature: string;

    @Input()
    signature: string;

    constructor() { }
}
