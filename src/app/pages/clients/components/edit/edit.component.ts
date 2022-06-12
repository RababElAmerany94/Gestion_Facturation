import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'app/core/enums/client-type.enum';
import { DossierActionRoute } from 'app/core/enums/dossier-action-route.enum';
import { GenreClient } from 'app/core/enums/genre-client.enum';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { RouteName } from 'app/core/enums/route-name.enum';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { StringHelper } from 'app/core/helpers/string';
import { UserHelper } from 'app/core/helpers/user';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Contact } from 'app/core/models/contacts/contact';
import { Address } from 'app/core/models/general/address.model';
import { IClientRelationModel } from 'app/core/models/general/client-relation.model';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { IClient, IClientCommercials, IClientModel } from '../../client.model';

@Component({
    selector: 'kt-client-edit',
    templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditTemplateComponent<IClientModel> implements OnInit {

    /** upd emitter */
    @Output() updateEvent = new EventEmitter();

    @Input() set client(client: IClient) {
        if (client != null) {
            this.currentClient = client;
            this.setClientForm(client);
        }
        if (this.isShowMode()) {
            this.form.disable();
        }
    }

    currentClient: IClient;
    address: Address[] = [];
    relations: IClientRelationModel[] = [];
    contacts: Contact[] = [];
    clientType: IDropDownItem<number, string>[] = [];
    genreClient: IDropDownItem<number, string>[] = [];
    clientCommercials: IClientCommercials[] = [];

    constructor(
        private toastService: ToastService,
        private numerationService: NumerationService,
        private translate: TranslateService,
        private router: Router) {
        super();
    }

    ngOnInit() {
        this.chargeDropDownClientType();
        this.chargeDropDownGenreClient();
    }

    /**
     * build client object
     */
    buildClientObject(): IClientModel {
        const clientModel: IClientModel = { ...this.form.value };
        clientModel.addresses = this.address;
        clientModel.contacts = this.contacts;
        clientModel.relations = this.relations;
        clientModel.primeCEEId = !StringHelper.isEmptyOrNull(clientModel.primeCEEId) ? clientModel.primeCEEId : null;
        clientModel.logementTypeId = !StringHelper.isEmptyOrNull(clientModel.logementTypeId) ? clientModel.logementTypeId : null;
        clientModel.typeChauffageId = !StringHelper.isEmptyOrNull(clientModel.typeChauffageId) ? clientModel.typeChauffageId : null;
        clientModel.agenceId = UserHelper.getAgenceId();
        clientModel.commercials = this.buildClientCommercial();
        return clientModel;
    }

    /**
     * build client commercial
     */
    buildClientCommercial() {
        const clientCommercials = [];
        const commercialIds = this.form.get('commercials').value as string[];
        if (commercialIds != null) {
            commercialIds.forEach(commercialId => {
                const clientCommercial = this.clientCommercials.find(e => e.commercialId === commercialId);
                if (clientCommercial != null) {
                    clientCommercials.push(clientCommercial);
                } else {
                    clientCommercials.push({ commercialId });
                }
            });
        }
        return clientCommercials;
    }

    /**
     * save client
     */
    save() {
        if (this.form.get('type').value === ClientType.Obliges) {
            this.form.get('genre').setValue(GenreClient.Client);
        }
        if (this.form.valid) {
            if (this.isAddMode()) {
                this.addEvent.emit(this.buildClientObject());
            } else {
                this.editEvent.emit(this.buildClientObject());
            }
        } else {
            this.form.markAllAsTouched();
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * set client form
     */
    setClientForm(client: IClient) {
        this.clientCommercials = client.commercials;
        this.form.get('reference').setValue(client.reference);
        this.form.get('firstName').setValue(client.firstName);
        this.form.get('origin').setValue(client.origin);
        this.form.get('lastName').setValue(client.lastName);
        this.form.get('phoneNumber').setValue(client.phoneNumber);
        this.form.get('email').setValue(client.email);
        this.form.get('webSite').setValue(client.webSite);
        this.form.get('siret').setValue(client.siret);
        this.form.get('codeComptable').setValue(client.codeComptable);
        this.form.get('regulationModeId').setValue(client.regulationModeId);
        this.form.get('type').setValue(client.type);
        this.form.get('genre').setValue(client.genre);
        this.form.get('commercials').setValue(client?.commercials.map(e => e?.commercial?.id));
        this.form.get('noteDevis').setValue(client.noteDevis);
        this.form.get('agenceId').setValue(client.agenceId);
        this.form.get('dateReceptionLead').setValue(client.dateReceptionLead);
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
        this.form.get('labelPrimeCEE').setValue(client.labelPrimeCEE);
        this.form.get('sourceLeadId').setValue(client.sourceLeadId);
        this.form.get('typeChauffageId').setValue(client.typeChauffageId);
        this.form.get('isSousTraitant').setValue(client.isSousTraitant);
        this.contacts = client.contacts as Contact[];
        this.address = client.addresses as Address[];
        this.relations = client.relations;
    }

    /**
     * set addresses
     */
    setAddress(address: Address[]) {
        if (address) {
            this.address = address;
        }
    }

    /**
     * set client relation
     */
    setClientRelation(relations: IClientRelationModel[]) {
        if (relations) {
            this.relations = relations;
        }
    }

    /**
     * reset form
     */
    resetForm() {
        this.form.reset();
    }

    setContact(contact: Contact[]) {
        this.contacts = contact;
    }

    /**
     * generate les champs a un client
     */
    generateChampsClient() {
        let type: NumerationType;

        if (this.isClientProfessionnel()) {
            type = NumerationType.CLIENT_PROFESSIONNEL;
        } else if (this.isClientParticulier()) {
            type = NumerationType.CLIENT_PARTICULIER;
        } else if (this.isClientOblige()) {
            type = NumerationType.CLIENT_OBLIGES;
        }

        if (type != null) {
            this.numerationService
                .GenerateNumerotation(type)
                .subscribe(item => {
                    if (item.status === ResultStatus.Succeed) {
                        this.form.get('reference').setValue(item.value);
                    }
                });
        } else {
            this.form.get('reference').setValue('');
        }
    }

    /** charge genre client */
    chargeDropDownGenreClient() {
        this.genreClient = ConversionHelper.convertEnumToListKeysValues(GenreClient, 'number');
        this.genreClient.forEach(e => e.text = `GENRE_CLIENT.${e.value}`);
    }

    /** charge dropdown type of client */
    chargeDropDownClientType() {
        this.clientType = ConversionHelper.convertEnumToListKeysValues(ClientType, 'number');
        this.clientType.forEach(e => e.text = `CLIENT_TYPE.${e.value}`);
    }

    /**
     * generate coode comptable
     */
    generateCodeComptable() {
        this.form.get('codeComptable').setValue(
            (StringHelper.isEmptyOrNull(this.form.controls.firstName.value) ? '' : this.form.controls.firstName.value.replace(/ /g, ''))
        );
    }

    /** check is client Obliges */
    isClientOblige() {
        return this.form.get('type').value === ClientType.Obliges;
    }

    /** check is client particulier */
    isClientParticulier() {
        return this.form.get('type').value === ClientType.Particulier;
    }

    /** check is client professionnel */
    isClientProfessionnel() {
        return this.form.get('type').value === ClientType.Professionnel;
    }

    /**
     * add dossier
     */
    addDossier() {
        const navigationExtras: NavigationExtras = {
            state: {
                client: this.currentClient
            },
            queryParams: {
                mode: DossierActionRoute.AddFromClient
            }
        };
        this.router.navigate([`/${RouteName.Dossier}`], navigationExtras);
    }

    /**
     * add client
     */
    editClient() {
        this.updateEvent.emit(this.currentClient.id);
    }

}
