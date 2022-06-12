import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'app/core/enums/client-type.enum';
import { DevisStatus } from 'app/core/enums/devis-status.enum';
import { DevisType } from 'app/core/enums/devis-type.enum';
import { FactureType } from 'app/core/enums/facture-type.enum';
import { MontantType } from 'app/core/enums/montant-type.enum';
import { RemiseType } from 'app/core/enums/remise-type.enum';
import { CalculationToken, ICalculation } from 'app/core/helpers/calculation/icalculation';
import { DateHelper } from 'app/core/helpers/date';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { UserHelper } from 'app/core/helpers/user';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Address } from 'app/core/models/general/address.model';
import { IArticle } from 'app/core/models/general/article.model';
import { IResultCalculationModel } from 'app/core/models/general/calculation.model';
import { IClient } from 'app/pages/clients/client.model';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { FactureHelper } from 'app/pages/facture/facture-helper';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { IMatMenuItem } from 'app/shared/ui-material-elements/custom-mat-menu/custom-mat-menu.component';
import { UserProfile } from '../../../../core/enums/user-role.enums';
import { DevisHelper } from '../../devis-helper';
import { IDevis, IDevisModel, IFactureDevisData } from '../../devis.model';
import { AcompteComponent } from '../acompte/acompte.component';
import { PopUpStatusComponent } from '../pop-up-status/pop-up-status.component';

@Component({
    selector: 'kt-edit-devis',
    templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditTemplateComponent<IDevisModel> {

    @Output() downloadEvent = new EventEmitter();
    @Output() printDevisEvent = new EventEmitter();
    @Output() dupliquerEvent = new EventEmitter();
    @Output() enPerduDevisEvent = new EventEmitter();
    @Output() signeDevisEvent = new EventEmitter();
    @Output() transferToFactureEvent = new EventEmitter<IFactureDevisData>();
    @Output() displayFileEvent = new EventEmitter();

    /** set the devis */
    @Input()
    set Devis(devis: IDevis) {
        if (devis != null) {
            this.devis = devis;
            this.bonCommandeId = devis.bonCommandeId;
            this.selectedClient = devis?.client;
            this.dossier = devis?.dossier;
            this.remise = devis.remise;
            this.remiseType = devis.remiseType;
            this.articles = devis.articles;
            this.siteIntervention = devis.siteIntervention;
            this.relatedDocs = devis.documentAssociates;
            this.nouveauAvancementPercent = DevisHelper.percentFacturationDevis(this.calculation, devis);
            this.menuItems = this.getMenuItems();
        }
        if (this.isAddMode()) {
            this.form.get('userId').setValue(UserHelper.getUserId());
        }
    }

    /** set the type of devis */
    @Input()
    set Type(type: DevisType) {
        if (type != null) {
            this.currentType = type;
        }
    }

    /** set the dossier of devis */
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

    /** the current devis to modify */
    devis: IDevis;

    /** the status of devis */
    status = DevisStatus;

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

    /** the current type of devis */
    currentType: DevisType;
    devisTypes = DevisType;

    /** the dossier of devis */
    dossier: IDossier;

    /** the enumeration of client types */
    clientType = ClientType;

    /** the roleId of user */
    userProfile = UserProfile;

    nouveauAvancementPercent: number;

    menuItems: IMatMenuItem[] = [];

    bonCommandeId: string;

    constructor(
        private translate: TranslateService,
        private toastService: ToastService,
        private dialogMat: MatDialog,
        @Inject(CalculationToken) private calculation: ICalculation,
    ) {
        super();
    }

    //#region save changes

    /**
     * save Changes
     */
    save(status: DevisStatus) {
        if (this.form.valid) {
            if (status !== DevisStatus.Brouillon && this.resultCalculation?.articles?.length === 0) {
                this.toastService.warning(this.translate.instant('ERRORS.ADD_LEAST_ARTICLE'));
                return;
            }
            const devis = this.buildDevisObject(status);
            if (this.isEditMode()) {
                this.editEvent.emit(devis);
            } else {
                this.addEvent.emit(devis);
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    //#endregion

    //#region helpers

    /**
     * build Devis object
     */
    buildDevisObject(status: DevisStatus): IDevisModel {
        const devisModel: IDevisModel = { ...this.form.value };

        devisModel.status = status;
        devisModel.dateCreation = DateHelper.formatDate(devisModel.dateCreation);
        devisModel.dateVisit = DateHelper.formatDate(devisModel.dateVisit);
        devisModel.dateVisitePrealable = devisModel.dateVisitePrealable ? DateHelper.formatDate(devisModel.dateVisitePrealable) : null;
        devisModel.totalReduction = this.resultCalculation.totalReduction;
        devisModel.totalPaid = this.resultCalculation.totalPaid;
        devisModel.totalTTC = this.resultCalculation.totalTTC;
        devisModel.siteIntervention = this.siteIntervention;
        devisModel.articles = this.resultCalculation.articles;
        devisModel.totalHT = this.resultCalculation.remise > 0 ? this.resultCalculation.totalHTRemise : this.resultCalculation.totalHT;
        devisModel.remise = this.resultCalculation.remise;
        devisModel.remiseType = this.resultCalculation.remiseType;
        devisModel.userId = !StringHelper.isEmptyOrNull(devisModel.userId) ? devisModel.userId : null;

        devisModel.bonCommandeId = this.bonCommandeId;
        devisModel.agenceId = UserHelper.getAgenceId();
        if (this.currentType != null) {
            devisModel.type = this.currentType;
        } else {
            devisModel.type = DevisType.Normal;
        }
        if (this.dossier != null) {
            devisModel.dossierId = this.dossier.id;
            devisModel.clientId = this.dossier.clientId;
            devisModel.siteIntervention = this.dossier.siteIntervention;
        }

        return devisModel;
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
        // this.form.get('userId').setValue(client?.commercials[0]?.commercialId);
    }

    //#endregion

    //#region actions

    /**
     * change status to perdu devis
     */
    enPerduDevis() {
        const data = { isSigne: false };
        DialogHelper.openDialog(this.dialogMat, PopUpStatusComponent, DialogHelper.SIZE_SMALL, data).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.devis.raisonPerdue = result.raisonPerdue;
                this.devis.status = DevisStatus.EnPerdu;
                this.enPerduDevisEvent.emit(this.devis);
            }
        });
    }

    /**
     * change status to signe devis
     */
    signeDevis() {
        const data = { isSigne: true };
        DialogHelper.openDialog(this.dialogMat, PopUpStatusComponent, DialogHelper.SIZE_SMALL, data).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.devis.dateSignature = result.dateSignature;
                this.devis.status = DevisStatus.Signe;
                this.signeDevisEvent.emit(this.devis);
            }
        });
    }

    /**
     * add acompte to devis
     */
    addAcompte() {
        const data = {
            devis: this.devis
        };
        DialogHelper.openDialog(this.dialogMat, AcompteComponent, DialogHelper.SIZE_MEDIUM, data).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                const factureDevis: IFactureDevisData = {
                    numeroAH: this.dossier?.numeroAH,
                    type: result.type,
                    factureDevis: {
                        devis: this.devis,
                        devisId: this.devis.id,
                        facture: null,
                        factureId: null,
                        montant: parseFloat(result.montant),
                        montantType: result.montantType,
                        createdOn: new Date()
                    }
                }
                this.transferToFactureEvent.emit(factureDevis);
            }
        });
    }

    addFactureCloure() {
        const factureDevis: IFactureDevisData = {
            numeroAH: this.dossier?.numeroAH,
            type: FactureType.Cloture,
            factureDevis: {
                devis: this.devis,
                devisId: this.devis.id,
                facture: null,
                factureId: null,
                montant: FactureHelper
                    .calculateFactureCloture(this.calculation, this.devis.factures)
                    .totalTTC,
                montantType: MontantType.Currency,
                createdOn: new Date()
            }
        }
        this.transferToFactureEvent.emit(factureDevis);
    }

    /** transfer devis to facture */
    transferDevisToFacture() {
        const factureDevis: IFactureDevisData = {
            numeroAH: this.dossier?.numeroAH,
            type: FactureType.Classic,
            factureDevis: {
                devis: this.devis,
                devisId: this.devis.id,
                facture: null,
                factureId: null,
                montant: this.devis.totalTTC,
                montantType: MontantType.Currency,
                createdOn: new Date()
            }
        }
        this.transferToFactureEvent.emit(factureDevis);
    }

    displayFile() {
        this.displayFileEvent.emit(this.devis?.id)
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
                action: () => this.dupliquerEvent.emit(this.devis),
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
                action: () => this.printDevisEvent.emit(),
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
                appear: DevisHelper.canSigne(this.devis?.status),
                action: () => this.signeDevis(),
                icon: 'edit',
                title: 'STATUS.SIGNE'
            },
            {
                appear: DevisHelper.canMarkedPerdu(this.devis?.status),
                action: () => this.enPerduDevis(),
                icon: 'signal_cellular_no_sim',
                title: 'LABELS.PERDU'
            },
            {
                appear: DevisHelper.canAddFactureAcompte(this.devis, this.nouveauAvancementPercent),
                action: () => this.addAcompte(),
                icon: 'pie_chart',
                title: 'LABELS.ACCOMPTE'
            },
            {
                appear: DevisHelper.canAddFactureCloture(this.devis),
                action: () => this.addFactureCloure(),
                icon: 'settings',
                title: 'LABELS.FACTUR_CLOTURE'
            },
            {
                appear: DevisHelper.canTransferToFacture(this.devis?.status),
                action: () => this.transferDevisToFacture(),
                icon: 'redo',
                title: 'LABELS.TRANSFER_FACTURE'
            },
        ];
        return items;
    }

    //#endregion

}
