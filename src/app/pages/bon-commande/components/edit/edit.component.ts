import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BonCommandeStatus } from 'app/core/enums/bon-commande-status.enum';
import { ClientType } from 'app/core/enums/client-type.enum';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { UserHelper } from 'app/core/helpers/user';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Address } from 'app/core/models/general/address.model';
import { IArticle } from 'app/core/models/general/article.model';
import { IResultCalculationModel } from 'app/core/models/general/calculation.model';
import { IClient } from 'app/pages/clients/client.model';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { RaisonAnnulationComponent } from 'app/shared/raison-annulation/raison-annulation.component';
import { IMatMenuItem } from 'app/shared/ui-material-elements/custom-mat-menu/custom-mat-menu.component';
import { BonCommandeHelper } from '../../bon-commande-helper';
import { IBonCommande, IBonCommandeModel } from '../../bon-commande.model';

@Component({
    selector: 'kt-edit-bon-commande',
    templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditTemplateComponent<IBonCommandeModel> {

    @Output() downloadEvent = new EventEmitter();
    @Output() printBonCommandeEvent = new EventEmitter();
    @Output() dupliquerEvent = new EventEmitter();
    @Output() signeBonCommandeEvent = new EventEmitter();
    @Output() markBonCommandeAnnulerEvent = new EventEmitter<IBonCommande>();
    @Output() transferToDevisEvent = new EventEmitter<IBonCommande>();
    @Output() displayFileEvent = new EventEmitter();

    /** set the bonCommande */
    @Input()
    set BonCommande(bonCommande: IBonCommande) {
        if (bonCommande != null) {
            this.bonCommande = bonCommande;
            this.selectedClient = bonCommande?.client;
            this.dossier = bonCommande?.dossier;
            this.articles = bonCommande.articles;
            this.siteIntervention = bonCommande.siteIntervention;
            this.relatedDocs = bonCommande.documentAssociates;
            this.remise = bonCommande.remise;
            this.remiseType = bonCommande.remiseType;
            this.menuItems = this.getMenuItems();
        }
        if (this.isAddMode()) {
            this.form.get('userId').setValue(UserHelper.getTokeInfo().userId);
        }
    }

    /** set the type of bonCommande */
    @Input()
    set Type(type: DevisType) {
        if (type != null) {
            this.currentType = type;
        }
    }

    /** set the dossier of bonCommande */
    @Input()
    set Dossier(dossier: IDossier) {
        if (dossier != null) {
            this.dossier = dossier;
            this.selectedClient = dossier?.client;
            this.siteIntervention = dossier.siteIntervention;
            this.form.get('clientId').setValue(this.dossier.clientId);
            if (this.isAddMode()) {
                this.form.get('userId').setValue(null);
            }
        }
    }

    /** FormGroup */
    form: FormGroup;

    /** the current bonCommande to modify */
    bonCommande: IBonCommande;

    /** the status of bonCommande */
    status = BonCommandeStatus;

    /** the site intervention */
    siteIntervention: Address;

    /** the site intervention */
    articles: IArticle[] = [];

    /** current selected client  */
    selectedClient: IClient;

    /** the result of calculation */
    resultCalculation: IResultCalculationModel;

    /** type of remise */
    remiseType = RemiseType.Percent;

    /** remise */
    remise = 0;

    /** the current type of bonCommande */
    currentType: DevisType;
    devisTypes = DevisType;

    /** the dossier of bonCommande */
    dossier: IDossier;

    /** the enumeration of client types */
    clientType = ClientType;

    /** the roleId of user */
    userProfile = UserProfile;

    nouveauAvancementPercent: number;

    menuItems: IMatMenuItem[] = [];

    constructor(
        private translate: TranslateService,
        private toastService: ToastService,
        private dialogMat: MatDialog,
    ) {
        super();
    }

    //#region save changes

    /**
     * save Changes
     */
    save(status: BonCommandeStatus) {
        if (this.form.valid) {
            const bonCommande = this.buildBonCommandeObject(status);
            if (this.isEditMode()) {
                this.editEvent.emit(bonCommande);
            } else {
                this.addEvent.emit(bonCommande);
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    //#endregion

    //#region helpers

    /**
     * build BonCommande object
     */
    buildBonCommandeObject(status: BonCommandeStatus): IBonCommandeModel {
        const bonCommandeModel: IBonCommandeModel = { ...this.form.value };

        bonCommandeModel.status = status;
        bonCommandeModel.totalReduction = this.resultCalculation.totalReduction;
        bonCommandeModel.totalPaid = this.resultCalculation.totalPaid;
        bonCommandeModel.totalTTC = this.resultCalculation.totalTTC;
        bonCommandeModel.siteIntervention = this.siteIntervention;
        bonCommandeModel.articles = this.resultCalculation.articles;
        bonCommandeModel.totalHT = this.resultCalculation.remise > 0 ?
            this.resultCalculation.totalHTRemise : this.resultCalculation.totalHT;
        bonCommandeModel.remise = this.resultCalculation.remise;
        bonCommandeModel.remiseType = this.resultCalculation.remiseType;
        bonCommandeModel.userId = !StringHelper.isEmptyOrNull(bonCommandeModel.userId) ? bonCommandeModel.userId : null;
        bonCommandeModel.agenceId = UserHelper.getAgenceId();
        if (this.currentType != null) {
            bonCommandeModel.type = this.currentType;
        } else {
            bonCommandeModel.type = DevisType.Normal;
        }
        if (this.dossier != null) {
            bonCommandeModel.dossierId = this.dossier.id;
            bonCommandeModel.clientId = this.dossier.clientId;
            bonCommandeModel.siteIntervention = this.dossier.siteIntervention;
        }

        return bonCommandeModel;
    }

    //#endregion

    //#region view setters

    /**
     * set intervention address
     */
    setSiteIntervention(address: Address) {
        this.siteIntervention = address;
    }

    /**
     * set result calculation
     */
    setResultCalculation(resultCalculation: IResultCalculationModel) {
        this.resultCalculation = resultCalculation;
    }

    /**
     * event of change select client
     * @param client the client object
     */
    changeClientEvent(client: IClient) {
        this.selectedClient = client;
        // this.form.get('userId').setValue(client.commercials[0].commercialId);
    }

    //#endregion

    //#region actions

    /**
     * annuler bon commande
     */
    annuleeBonCommande() {
        DialogHelper
            .openDialog(this.dialogMat, RaisonAnnulationComponent, DialogHelper.SIZE_SMALL, null)
            .subscribe(result => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.bonCommande.raisonAnnulation = result.raisonAnnulation;
                    this.markBonCommandeAnnulerEvent.emit(this.bonCommande);
                }
            });
    }

    /** transfer bonCommande to facture */
    transferBonCommandeToDevis() {
        this.transferToDevisEvent.emit(this.bonCommande);
    }

    displayFile() {
        this.displayFileEvent.emit(this.bonCommande?.id)
    }

    //#endregion

    //#region helpers

    /**
     * show contact my_company instead of technicien
     */
    isContactMY_COMPANY() {
        return this.currentType !== DevisType.Normal;
    }

    /**
     * menu items of actions
     */
    getMenuItems() {
        const items: IMatMenuItem[] = [
            {
                appear: true,
                action: () => this.dupliquerEvent.emit(this.bonCommande),
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
                action: () => this.printBonCommandeEvent.emit(),
                icon: 'print',
                title: 'LABELS.IMPRIMER'
            },
            {
                appear: !BonCommandeHelper.canAnnuler(this.bonCommande?.status),
                action: () => this.annuleeBonCommande(),
                icon: 'cancel',
                title: 'STATUS.ANNULE'
            },
            {
                appear: true,
                action: () => this.downloadEvent.emit(),
                icon: 'description',
                title: 'LABELS.DOWNLOAD'
            },
            {
                appear: BonCommandeHelper.canTransferToDevis(this.bonCommande?.status),
                action: () => this.transferBonCommandeToDevis(),
                icon: 'redo',
                title: 'LABELS.TRANSFER_BON_COMMANDE'
            },
        ];
        return items;
    }

    //#endregion

}
