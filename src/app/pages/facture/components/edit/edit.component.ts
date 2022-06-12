import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { FactureStatus } from 'app/core/enums/facture-status.enum';
import { FactureType } from 'app/core/enums/facture-type.enum';
import { MontantType } from 'app/core/enums/montant-type.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { DialogHelper } from 'app/core/helpers/dialog';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IArticle } from 'app/core/models/general/article.model';
import { IResultCalculationModel } from 'app/core/models/general/calculation.model';
import { IFactureClotureComponentOutput } from 'app/core/models/general/facture-cloture-component-output.model';
import { IDevis, IFactureDevisData } from 'app/pages/devis/devis.model';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { TableArticleMode } from 'app/shared/table-article/table-article-shell.component';
import { IMatMenuItem } from 'app/shared/ui-material-elements/custom-mat-menu/custom-mat-menu.component';
import { FactureHelper } from '../../facture-helper';
import { IFacture, IFactureDevis, IFactureDevisModel, IFactureModel } from '../../facture.model';
import { ObjectHelper } from 'app/core/helpers/object';
import { IClient } from 'app/pages/clients/client.model';
import { UserHelper } from 'app/core/helpers/user';

@Component({
    selector: 'kt-facture-edit',
    templateUrl: './edit.component.html',
    providers: [DatePipe]
})
export class EditComponent extends BaseEditTemplateComponent<IFactureModel> {

    @Output() downloadEvent = new EventEmitter();
    @Output() dupliquerEvent = new EventEmitter();
    @Output() cancelFactureEvent = new EventEmitter();
    @Output() printFactureEvent = new EventEmitter();
    @Output() displayFileEvent = new EventEmitter();

    @Input()
    set Facture(facture: IFacture) {
        if (facture != null) {
            this.articles = facture.articles;
            this.remise = facture.remise;
            this.remiseType = facture.remiseType;
            this.facture = facture;
            this.relatedDocs = facture.documentAssociates;
            this.menuItems = this.getMenuItems();
            this.selectedClient = facture?.client;
            if (facture.type !== FactureType.Classic) {
                const devisAssociated = facture.devis[0].devis;
                this.factureDevis = devisAssociated?.factures.filter(e => e.factureId !== facture.id)
                this.factureDevis.forEach(e => e.devis = devisAssociated);
                this.currentFactureDevis = facture.devis[0];
            }
            if (facture?.devis?.length > 0) {
                this.detectTableArticlesMode(facture?.devis.map(e => e.devis));
            }
        }
    }

    @Input()
    set Devis(value: IDevis[]) {
        if (value != null && value.length > 0) {
            this.devis = value;
            this.selectedClient = this.devis[0]?.client;
            if (this.transferDevisData == null || [FactureType.Classic, FactureType.Cloture].includes(this.transferDevisData.type)) {
                this.devis.forEach(element => this.articles = this.articles.concat(element.articles));
            } else {
                this.articles = [
                    FactureHelper.createArticleFactureAcompte(this.transferDevisData.factureDevis, this.calculation, this.datePipe)]
                this.resultCalculation = this.calculation.calculationGenerale(this.articles, this.remise, this.remiseType);
            }
            this.detectTableArticlesMode(value);
        }
    }

    @Input()
    set Data(value: IFactureDevisData) {
        if (!ObjectHelper.isNullOrEmpty(value)) {
            this.transferDevisData = value;
            this.factureType = this.transferDevisData.type;
            this.factureDevis = this.transferDevisData.factureDevis.devis.factures;
            this.currentFactureDevis = this.transferDevisData.factureDevis;
            this.selectedClient = this.currentFactureDevis?.devis?.client;
        }
    }

    /** the enumeration of status */
    status = FactureStatus;

    /** list of articles */
    articles: IArticle[] = [];

    /** the result of calculation */
    resultCalculation: IResultCalculationModel;

    /** type of remise */
    remiseType = RemiseType.Percent;

    /** remise */
    remise = 0;

    /** facture */
    facture: IFacture;

    /**
     * the list of ids of devis
     * associate with this facture
     */
    devis: IDevis[];

    /** type facture */
    factureType: FactureType = FactureType.Classic;

    /** types facture */
    factureTypes = FactureType;

    /** mode table articles */
    tableArticleMode = TableArticleMode.Normal;

    typeDevis = TableArticleMode;

    /** data of transfer devis to facture */
    transferDevisData: IFactureDevisData;

    /** facture devis of associated devis without current */
    factureDevis: IFactureDevis[] = [];

    /** current facture devis */
    currentFactureDevis: IFactureDevis;

    /** calculate of facture cloture */
    calculeFactureCloture: IFactureClotureComponentOutput;

    menuItems: IMatMenuItem[] = [];

    selectedClient: IClient;

    constructor(
        private translate: TranslateService,
        private toastService: ToastService,
        private matDialog: MatDialog,
        @Inject(CalculationToken) private calculation: ICalculation,
        private datePipe: DatePipe
    ) {
        super();
    }

    /**
     * set result calculation
     */
    setResultCalculation(resultCalculation: IResultCalculationModel) {
        this.resultCalculation = resultCalculation;
    }

    /**
     * save changes
     */
    save(status: FactureStatus) {
        if (this.form.valid) {
            if (status !== FactureStatus.BROUILLON && this.resultCalculation?.articles?.length === 0) {
                this.toastService.warning(this.translate.instant('ERRORS.ADD_LEAST_ARTICLE'));
                return;
            }
            if (this.isEditMode()) {
                this.editEvent.emit(this.buildFactureObject(status));
            } else {
                this.addEvent.emit(this.buildFactureObject(status));
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * build facture object
     */
    buildFactureObject(status: FactureStatus): IFactureModel {
        const facture: IFactureModel = { ...this.form.getRawValue() };

        facture.remise = this.resultCalculation.remise;
        facture.remiseType = this.resultCalculation.remiseType;
        facture.status = status;
        facture.type = this.factureType;
        facture.articles = this.resultCalculation.articles;
        facture.agenceId = UserHelper.getAgenceId();
        facture.devis = [];

        if (this.factureType === FactureType.Cloture) {
            facture.totalHT = this.calculeFactureCloture.totalHT;
            facture.totalTTC = this.calculeFactureCloture.totalTTC;
        } else {
            facture.totalHT = this.resultCalculation.remise > 0 ? this.resultCalculation.totalHTRemise : this.resultCalculation.totalHT;
            facture.totalTTC = this.resultCalculation.totalTTC;
        }

        if (this.devis != null && this.devis.length > 0) {
            if (this.transferDevisData != null) {
                facture.devis.push(this.currentFactureDevis);
                facture.type = this.transferDevisData.type;
                facture.numeroAH = this.transferDevisData.numeroAH;
                facture.totalPaid = this.transferDevisData.factureDevis.devis.totalPaid;
                facture.totalReduction = this.transferDevisData.factureDevis.devis.totalReduction;
            } else {
                this.devis.forEach(item => {
                    const factureDevis: IFactureDevisModel = {
                        montant: item.totalTTC,
                        montantType: MontantType.Currency,
                        devisId: item.id,
                    };
                    facture.devis.push(factureDevis);
                });
            }
        }

        return facture;
    }

    /** cancel facture */
    cancelFacture() {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('CONFIRMATION.CANCEL.HEADER'),
            message: this.translate.instant('CONFIRMATION.CANCEL.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.ANNULEZ_LA')
        }, () => {
            this.cancelFactureEvent.emit(this.facture);
        });
    }

    //#region helpers

    /**
     * menu items of actions
     */
    getMenuItems() {
        const items: IMatMenuItem[] = [
            {
                appear: !FactureHelper.canDupliquer(this.facture.type),
                action: () => this.dupliquerEvent.emit(this.facture),
                icon: 'content_copy',
                title: 'LABELS.DUPLIQUER'
            },
            {
                appear: true,
                action: () => this.displayFile(),
                icon: 'remove_red_eye',
                title: 'TITLES.PREVIEW_FILE'
            },
            {
                appear: true,
                action: () => this.printFactureEvent.emit(),
                icon: 'print',
                title: 'LABELS.IMPRIMER'
            },
            {
                appear: true,
                action: () => this.downloadEvent.emit(),
                icon: 'description',
                title: 'LABELS.DOWNLOAD'
            },
            {
                appear: !FactureHelper.isStatusAnnulee(this.facture?.status, this.facture?.type),
                action: () => this.cancelFacture(),
                icon: 'cancel',
                title: 'LABELS.CANCEL'
            },
        ];
        return items;
    }

    private detectTableArticlesMode(devis: IDevis[]) {
        if (devis.length === 1 && devis[0]?.type !== DevisType.Normal) {
            this.tableArticleMode = devis[0]?.type === DevisType.Euro ? TableArticleMode.Euro : TableArticleMode.Reduction;
        }
    }

    displayFile() {
        this.displayFileEvent.emit(this.facture?.id)
    }

    //#endregion
}
