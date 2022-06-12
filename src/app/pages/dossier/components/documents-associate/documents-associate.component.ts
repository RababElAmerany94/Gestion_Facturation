import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DocType } from 'app/core/enums/doctype.enums';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { RouteName } from 'app/core/enums/route-name.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { BonCommandeHelper } from 'app/pages/bon-commande/bon-commande-helper';
import { DevisHelper } from 'app/pages/devis/devis-helper';
import { FactureHelper } from 'app/pages/facture/facture-helper';
import { IDocumentAssociateModel, IDossier } from '../../dossier.model';

@Component({
    selector: 'kt-documents-associate',
    templateUrl: './documents-associate.component.html',
    styles: []
})
export class DocumentsAssociateComponent {

    @Output()
    deleteDevisEvent = new EventEmitter<string>();

    @Output()
    deleteFactureEvent = new EventEmitter<string>();

    @Output()
    deleteBonCommandeEvent = new EventEmitter<string>();

    @Output()
    addDocumentsEvent = new EventEmitter<DocType>();

    @Input()
    documentsAssociate: IDocumentAssociateModel[] = [];

    @Input()
    dossier: IDossier;

    /** navigationExtras */
    navigationExtras: NavigationExtras;

    /** related docs types */
    documentType = DocType;

    constructor(
        private translate: TranslateService,
        private dialog: MatDialog,
        private router: Router
    ) { }

    /**
     * delete document associate by index
     * @param id the id of document associate
     */
    deleteDocumentAssociate(id: string, type: DocType) {
        const name = type === this.documentType.Devis ? 'DEVIS' : (type === this.documentType.Facture ? 'FACTURE' : 'BON_COMMANDE');
        DialogHelper.openConfirmDialog(this.dialog, {
            header: this.translate.instant(`${name}.DELETE.HEADER`),
            message: this.translate.instant(`${name}.DELETE.MESSAGE`),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LA')
        }, () => {
            type === this.documentType.Devis ? this.deleteDevisEvent.emit(id) :
                (this.documentType.Devis ? this.deleteFactureEvent.emit(id) : this.deleteBonCommandeEvent.emit(id) );
        });
    }

    /**
     * edit document associate by index
     * @param index the index of document associate
     */
    editDocumentAssociate(index: number, type: DocType) {
        switch (type) {

            case this.documentType.Devis:
                const navigationExtras: NavigationExtras = {
                    state: {
                        dossier: this.dossier,
                        devis: this.documentsAssociate[index]
                    },
                    queryParams: {
                        mode: ModeEnum.Edit,
                        isMainRoute: false,
                        id: this.documentsAssociate[index].id
                    }
                };
                this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
                break;

            case this.documentType.Facture:
                this.navigationExtras = {
                    state: {
                        dossier: this.dossier,
                    },
                    queryParams: {
                        mode: ModeEnum.Edit,
                        id: this.documentsAssociate[index].id,
                        isMainRoute: false,
                    }
                };
                this.router.navigate([`/${RouteName.Facture}`], this.navigationExtras);
                break;

            case this.documentType.BonCommande:
                this.navigationExtras = {
                    state: {
                        dossier: this.dossier,
                    },
                    queryParams: {
                        mode: ModeEnum.Edit,
                        id: this.documentsAssociate[index].id,
                        isMainRoute: false,
                    }
                };
                this.router.navigate([`/${RouteName.BonCommande}`], this.navigationExtras);
                break;
        }
    }

    /**
     * can edit document associate
     */
    canEdit(document: IDocumentAssociateModel) {
        switch (document.type) {
            case DocType.Devis:
                return DevisHelper.canEdit(document.status);

            case DocType.Facture:
                return FactureHelper.canEditOrDelete(document.status);

            case DocType.BonCommande:
                return BonCommandeHelper.canEditOrDelete(document.status);

            default:
                return true;
        }
    }

    /**
     * can delete document associate
     */
    canDelete(document: IDocumentAssociateModel) {
        switch (document.type) {
            case DocType.Devis:
                return DevisHelper.canEdit(document.status);

            case DocType.Facture:
                return FactureHelper.canEditOrDelete(document.status);

            case DocType.BonCommande:
                return BonCommandeHelper.canEditOrDelete(document.status);

            default:
                return true;
        }
    }

    /** display details of document  */
    goToDocument(index: number, type: DocType) {
        switch (type) {

            case this.documentType.Devis:
                const navigationExtras: NavigationExtras = {
                    state: {
                        devis: this.documentsAssociate[index],
                        dossier: this.dossier,
                    },
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.documentsAssociate[index].id
                    }
                };
                this.router.navigate([`/${RouteName.Devis}`], navigationExtras);
                break;

            case this.documentType.Facture:
                this.navigationExtras = {
                    state: {
                        dossier: this.dossier,
                    },
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.documentsAssociate[index].id
                    }
                };
                this.router.navigate([`/${RouteName.Facture}`], this.navigationExtras);
                break;

            case this.documentType.BonCommande:
                this.navigationExtras = {
                    queryParams: {
                        mode: ModeEnum.Show,
                        id: this.documentsAssociate[index].id
                    }
                };
                this.router.navigate([`/${RouteName.BonCommande}`], this.navigationExtras);
                break;
        }
    }
}
