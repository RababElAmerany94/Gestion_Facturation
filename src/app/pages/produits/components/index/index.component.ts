import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { UserHelper } from 'app/core/helpers/user';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IChangeVisibilityProduitModel, IProduit, IProduitDataTables } from '../../produits.model';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { ProduitHelper } from 'app/core/helpers/produit';

@Component({
    selector: 'kt-produits-index',
    templateUrl: './index.component.html',
})
export class IndexComponent extends BaseIndexTemplateComponent<IProduitDataTables, string> implements OnInit {

    /**
     * change in filter options
     */
    @Output()
    filters = new EventEmitter<IFilterOption>();

    /**
     * edit agence event
     */
    @Output()
    editAgenceEvent = new EventEmitter<IProduitDataTables>();

    /**
     * show agence event
     */
    @Output()
    showAgenceEvent = new EventEmitter<IProduitDataTables>();

    /**
     * change visibility of Produit
     */
    @Output()
    changeVisibilityEvent = new EventEmitter<IChangeVisibilityProduitModel>();

    @Input()
    set data(data: IPagedResult<IProduit>) {
        if (data != null) {
            this.produits = { ...data as IPagedResult<any> };
            this.produits.value = data.value.map<IProduitDataTables>
                (e => this.mapIProduitIntoIProduitDataTable(e));
        }
    }

    /**
     * list of Produits
     */
    produits: IPagedResult<IProduitDataTables>;

    /** default reference */
    defaultOrderBy = 'reference';

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.Produits);
    }

    ngOnInit() {
        this.setColumns();
    }

    /**
     * set columns
     */
    setColumns() {
        this.columns = [
            {
                name: 'reference',
                nameTranslate: 'LABELS.REFERENCE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'designation',
                nameTranslate: 'LABELS.DESIGNATION',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'description',
                nameTranslate: 'LABELS.DESCRIPTION',
                isOrder: true,
                type: ColumnType.longText
            },
            {
                name: 'prixHT',
                nameTranslate: 'LABELS.PRIX_HT',
                isOrder: true,
                type: ColumnType.Currency
            },
            {
                name: 'tva',
                nameTranslate: 'LABELS.TVA',
                isOrder: true,
                type: ColumnType.Number
            },
            {
                name: 'unite',
                nameTranslate: 'LABELS.UNITE',
                isOrder: false,
                type: ColumnType.any
            },
        ];
    }

    /**
     * mapping produit to produit dataTables
     * @param produit the produit information
     */
    mapIProduitIntoIProduitDataTable(produit: IProduit): IProduitDataTables {
        const produitDataTables: IProduitDataTables = {
            id: produit.id,
            reference: produit.reference,
            designation: produit.designation,
            description: produit.description,
            prixHT: ProduitHelper.getPrixParAgenceOfProduit(produit),
            tva: ProduitHelper.getTvaParAgenceOfProduit(produit),
            unite: produit.unite,
            isPublic: produit.isPublic,
            agenceId: produit.agenceId,
            hasActions: UserHelper.hasOwner(produit.agenceId),
        };

        return produitDataTables;
    }

    // #region click events

    /**
     * edit button click
     */
    editClick(produit: IProduitDataTables) {
        if (produit.hasActions) {
            this.editEvent.emit(produit);
        } else {
            this.editAgenceEvent.emit(produit);
        }
    }

    /**
     * edit button click
     */
    showClick(produit: IProduitDataTables) {
        if (produit.hasActions) {
            this.showEvent.emit(produit);
        } else {
            this.showAgenceEvent.emit(produit);
        }
    }

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('LIST.DELETE.HEADER'),
            message: this.translate.instant('LIST.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    /**
     * active produit
     */
    activeClick(id: string) {
        this.changeVisibilityEvent.emit({ id, isPublic: true });
    }

    /**
     * deactivate produit
     */
    deactivateClick(id: string) {
        this.changeVisibilityEvent.emit({ id, isPublic: false });
    }

    //#endregion

}
