import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'app/core/enums/client-type.enum';
import { DocType } from 'app/core/enums/doctype.enums';
import { DossierStatus } from 'app/core/enums/dossier-status.enums';
import { DateHelper } from 'app/core/helpers/date';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { UserHelper } from 'app/core/helpers/user';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Contact } from 'app/core/models/contacts/contact';
import { IDossierPV } from 'app/core/models/dossierPVModel';
import { Address } from 'app/core/models/general/address.model';
import { IClient } from 'app/pages/clients/client.model';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { RaisonAnnulationComponent } from 'app/shared/raison-annulation/raison-annulation.component';
import { IMatMenuItem } from 'app/shared/ui-material-elements/custom-mat-menu/custom-mat-menu.component';
import { IDossier, IDossierModel } from '../../dossier.model';
import { DossierShared } from '../../dosssier-shared';
import { AssignCommercialComponent } from '../assign-commercial/assign-commercial.component';

@Component({
    selector: 'kt-dossier-edit',
    templateUrl: './edit.component.html',
    providers: [DatePipe]
})
export class EditComponent extends BaseEditTemplateComponent<IDossierModel> {

    @Output() addDocumentEvent = new EventEmitter<{ type: DocType, dossier: IDossier }>();
    @Output() deleteDevisEvent = new EventEmitter<string>();
    @Output() generateReferenceEvent = new EventEmitter();
    @Output() deleteBonCommandeEvent = new EventEmitter<string>();
    @Output() updateEvent = new EventEmitter();
    @Output() markDossierPerduEvent = new EventEmitter();
    @Output() markDossierAssignerEvent = new EventEmitter();

    /** set the date intervention dossier */
    @Input()
    set Dossier(dossier: IDossier) {
        if (dossier != null) {
            this.selectedClient = dossier.client;
            this.dossierPV = dossier.pVs;
            this.siteIntervention = dossier.siteIntervention;
            this.contact = dossier.contact;
            this.currentStatus = dossier.status;
            this.informationsSupplementaire = dossier.siteInstallationInformationsSupplementaire;
            this.dossier = dossier;
            this.setDataInForm(dossier);
            this.menuItems = this.getMenuItems();
        }
        if (this.isShowMode()) {
            this.form.disable();
        }
    }

    @Input()
    set client(value: IClient) {
        if (value != null) {
            this.form.get('clientId').setValue(value.id);
            this.setDataClientInForm(value);
            this.selectedClient = value;
        }
    }

    /** the enumeration status of dossier  */
    status = DossierStatus;

    /** the current status of dossier in edit and show */
    currentStatus: DossierStatus;

    /** FormGroup */
    form: FormGroup;

    /** the site intervention */
    siteIntervention: Address;

    /** the current dossier of this object  */
    dossier: IDossier;

    /** the contact */
    contact: Contact;

    /** current selected client */
    selectedClient: IClient;

    /** the enumeration of client types */
    clientType = ClientType;

    /** the current dossier of this object  */
    dossierPV: IDossierPV[];

    /** the additional information of site installation */
    informationsSupplementaire: { [key: string]: string; };

    menuItems: IMatMenuItem[] = [];

    constructor(
        private translate: TranslateService,
        private toastService: ToastService,
        private dialog: MatDialog,
        private datePipe: DatePipe
    ) {
        super();
    }

    //#region form

    /**
     * setData form
     */
    setDataInForm(dossier: IDossier) {
        this.form.setValue({
            reference: dossier.reference,
            datePose: dossier.datePose,
            clientId: dossier.clientId,
            firstPhoneNumber: dossier.firstPhoneNumber,
            secondPhoneNumber: dossier.secondPhoneNumber,
            note: dossier.note,
            siteIntervention: dossier.siteIntervention,
            dateReceptionLead: dossier.dateReceptionLead,
            dateCreation: dossier.dateCreation,
            dateExpiration: dossier.dateExpiration,
            sourceLeadId: dossier.sourceLeadId,
            logementTypeId: dossier.logementTypeId,
            parcelleCadastrale: dossier.parcelleCadastrale,
            surfaceTraiter: dossier.surfaceTraiter,
            nombrePersonne: dossier.nombrePersonne,
            isMaisonDePlusDeDeuxAns: dossier.isMaisonDePlusDeDeuxAns,
            precarite: dossier.precarite,
            revenueFiscaleReference: dossier.revenueFiscaleReference,
            numeroAH: dossier.numeroAH,
            typeTravaux: dossier.typeTravaux,
            raisonAnnulation: dossier?.raisonAnnulation,
            primeCEEId: dossier.primeCEEId,
            typeChauffageId: dossier.typeChauffageId,
            dateRDV: dossier.dateRDV != null ? this.datePipe.transform(dossier.dateRDV, 'short') : null,
            commercial: dossier.commercial != null ? dossier.commercial.fullName : '',
        });
    }

    /**
     * setData form
     */
    setDataClientInForm(client: IClient) {
        this.form.get('dateReceptionLead').setValue(client.dateReceptionLead);
        this.form.get('firstPhoneNumber').setValue(client.phoneNumber);
        this.form.get('logementTypeId').setValue(client.logementTypeId);
        this.form.get('parcelleCadastrale').setValue(client.parcelleCadastrale);
        this.form.get('surfaceTraiter').setValue(client.surfaceTraiter);
        this.form.get('precarite').setValue(client.precarite);
        this.form.get('nombrePersonne').setValue(client.nombrePersonne);
        this.form.get('isMaisonDePlusDeDeuxAns').setValue(client.isMaisonDePlusDeDeuxAns);
        this.form.get('revenueFiscaleReference').setValue(client.revenueFiscaleReference);
        this.form.get('numeroAH').setValue(client.numeroAH);
        this.form.get('typeTravaux').setValue(client.typeTravaux);
        this.form.get('primeCEEId').setValue(client.primeCEEId);
        this.form.get('sourceLeadId').setValue(client.sourceLeadId);
        this.form.get('typeChauffageId').setValue(client.typeChauffageId);
    }

    //#endregion

    //#region save changes

    /**
     * save Changes
     */
    async saveBase(callback: () => Promise<IDossierModel>) {
        if (this.form.valid) {
            if (this.form.value.firstPhoneNumber === this.form.value.secondPhoneNumber) {
                this.toastService.warning(this.translate.instant('ERRORS.PHONE_NUMBER_NOT_UNIQUE'));
                return;
            } else {
                const dossier: IDossierModel = await callback();

                if (dossier != null) {
                    if (this.isEditMode()) {
                        this.editEvent.emit(dossier);
                    } else {
                        this.addEvent.emit(dossier);
                    }
                }
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * save Changes
     */
    async save(status: DossierStatus) {
        this.saveBase(async () => {
            let commercialId = null;
            let dateRDV = null;

            if (status === DossierStatus.Assigne) {
                const result = await this.assignerDossier();
                if (result != null) {
                    commercialId = result.commercialId;
                    dateRDV = result.dateRDV;
                }
                if (result == null) {
                    return;
                }
            }

            return this.buildDossierObject(status, commercialId, dateRDV);
        });
    }

    /**
     * save Changes
     */
    async valide(status: DossierStatus) {
        this.saveBase(async () => {
            let commercialId = null;
            let dateRDV = null;

            if (this.dossier.commercialId == null) {
                const result = await this.assignerDossier();
                if (result != null) {
                    commercialId = result.commercialId;
                    dateRDV = result.dateRDV;
                }
                if (result == null) {
                    return;
                }
            } else {
                commercialId = this.dossier.commercialId;
                dateRDV = this.dossier.dateRDV;
            }

            return this.buildDossierObject(status, commercialId, dateRDV);
        });
    }
    //#endregion

    //#region helpers

    /**
     * add devis
     */
    addDocument(type: DocType) {
        const data = {
            type,
            dossier: this.dossier,
        }
        this.addDocumentEvent.emit(data);
    }

    /**
     * assigner dossier to commercial
     */
    async assignerDossier(): Promise<{ commercialId: number, dateRDV: Date }> {
        const data = this.dossier == null ? null : {
            commercialId: this.dossier.commercialId,
            dateRDV: this.dossier.dateRDV,
            dossierId: this.dossier.id,
        };
        const result = await DialogHelper.openDialog(this.dialog, AssignCommercialComponent, DialogHelper.SIZE_MEDIUM, data).toPromise();
        if (!StringHelper.isEmptyOrNull(result)) {
            return result;
        } else {
            return null;
        }
    }

    /**
     * build dossier object
     */
    buildDossierObject(status: DossierStatus, commercialId: string, dateRDV: Date): IDossierModel {
        const dossierModel: IDossierModel = { ...this.form.value };
        dossierModel.status = status;
        dossierModel.datePose = dossierModel.datePose ? DateHelper.formatDate(dossierModel.datePose) : null;
        dossierModel.commercialId = commercialId;
        dossierModel.dateRDV = dateRDV;
        dossierModel.siteIntervention = this.siteIntervention != null ? this.siteIntervention : null;
        dossierModel.contact = this.contact != null ? this.contact : null;
        dossierModel.clientId = this.selectedClient.id;
        dossierModel.agenceId = UserHelper.getAgenceId();
        dossierModel.logementTypeId = !StringHelper.isEmptyOrNull(dossierModel.logementTypeId) ? dossierModel.logementTypeId : null;
        dossierModel.primeCEEId = !StringHelper.isEmptyOrNull(dossierModel.primeCEEId) ? dossierModel.primeCEEId : null;
        dossierModel.typeChauffageId = !StringHelper.isEmptyOrNull(dossierModel.typeChauffageId) ? dossierModel.typeChauffageId : null;
        dossierModel.siteInstallationInformationsSupplementaire = this.informationsSupplementaire;
        return dossierModel;
    }

    /**
     * set site d'intervention
     */
    setSiteIntervention(address: Address) {
        this.siteIntervention = address;
    }

    /**
     * set contact
     */
    setContact(contact: Contact) {
        this.contact = contact;
    }

    /**
     * set the additional information of site installation
     */
    setInformationsSupplementaire(value: { [key: string]: string; }) {
        this.informationsSupplementaire = value;
    }

    /**
     * set client
     * @param client the client object
     */
    setClient(client: IClient) {
        this.selectedClient = client;
        this.setDataClientInForm(client);
        if (client.phoneNumber != null) {
            this.form.get('firstPhoneNumber').setValue(client.phoneNumber);
        }
        this.generateDossierReference(client.id);
    }

    /**
     * generer reference a un dossier
     */
    generateDossierReference(id: string) {
        this.generateReferenceEvent.emit(id);
    }

    /**
     * can show documents associate
     */
    canShowDocumentsAssociate() {
        if (this.dossier == null) {
            return false;
        }
        return DossierStatus.EnAttente !== this.dossier.status;
    }

    /**
     * can dossier be en attend
     */
    canEnAttend() {
        return this.isAddMode() || [DossierStatus.EnAttente].includes(this.currentStatus);
    }

    /**
     * can dossier be assigne
     */
    canAssigne() {
        return DossierShared.canAssigne(this.currentStatus);
    }

    /**
     * can dossier be perdu
     */
    canPerdu(status: DossierStatus) {
        return [DossierStatus.Assigne, DossierStatus.EnRetard, DossierStatus.EnAttente].includes(status);
    }

    /**
     * can valider dossier
     */
    canValider() {
        return DossierStatus.Assigne === this.currentStatus;
    }

    /**
     * can Edit Or Delete dossier
     */
    canEditOrDelete() {
        return DossierShared.canEditOrDelete(this.dossier?.status);
    }
    /**
     * menu items of actions
     */
    getMenuItems() {
        const items: IMatMenuItem[] = [
            {
                appear: this.canPerdu(this.dossier?.status),
                action: () => this.markDossierPerduEvent.emit(this.dossier?.id),
                icon: 'cancel_presentation',
                title: 'STATUS.PERDU'
            },
            {
                appear: this.canEditOrDelete(),
                action: () => this.updateEvent.emit(this.dossier?.id),
                icon: 'edit',
                title: 'LABELS.EDIT'
            },
            {
                appear: this.canAssigne(),
                action: () => this.markDossierAssignerEvent.emit(this.dossier?.id),
                icon: 'perm_contact_calendar',
                title: 'STATUS.ASSIGNE'
            },
        ];
        return items;
    }

    //#endregion
}
