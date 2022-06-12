import { Component, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DocType } from 'app/core/enums/doctype.enums';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { RouteName } from 'app/core/enums/route-name.enum';
import { IDocumentAssociate } from 'app/core/models/general/documentAssociate.model';

@Component({
    selector: 'kt-shared-related-docs',
    templateUrl: './shared-related-docs.component.html'
})
export class SharedRelatedDocsComponent {

    @Input()
    set data(value: IDocumentAssociate[]) {
        if (value != null) {
            this.items = value;
        }
    }

    /** related docs types */
    documentType = DocType;

    /** list of related docs */
    items: IDocumentAssociate[];

    /** navigationExtras */
    navigationExtras: NavigationExtras;

    constructor(
        private router: Router
    ) { }

    /** display details of document  */
    goToDocument(index: number, type: DocType) {
        switch (type) {

            case this.documentType.Devis:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.items[index].id
                    }
                };
                this.router.navigate([`/${RouteName.Devis}`], this.navigationExtras);
                break;

            case this.documentType.Paiement:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.items[index]
                    }
                };
                this.router.navigate([`/${RouteName.Paiement}`], this.navigationExtras);
                break;

            case this.documentType.Facture:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.items[index].id
                    }
                };
                this.router.navigate([`/${RouteName.Facture}`], this.navigationExtras);
                break;

            case this.documentType.Avoir:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.items[index].id
                    }
                };
                this.router.navigate([`/${RouteName.Avoir}`], this.navigationExtras);
                break;

            case this.documentType.Dossier:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.items[index].id
                    }
                };
                this.router.navigate([`/${RouteName.Dossier}`], this.navigationExtras);
                break;

            case this.documentType.BonCommande:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.items[index].id
                    }
                };
                this.router.navigate([`/${RouteName.BonCommande}`], this.navigationExtras);
                break;
        }
    }
}
