import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Contact } from 'app/core/models/contacts/contact';
import { Address } from 'app/core/models/general/address.model';
import { IAgence, IAgenceModel } from '../../agence.model';

@Component({
    selector: 'kt-agence-edit',
    templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditTemplateComponent<IAgenceModel> {

    @Input() set Agence(val: IAgence) {
        this.form.reset();
        if (val != null) {
            this.setAgenceInForm(val);
        }
        if (this.isShowMode()) {
            this.form.disable();
        }
    }

    /** the address delivery */
    adresseLivraison: Address[] = [];

    /** the address billing */
    adresseFacturation: Address[] = [];

    /** the list contacts */
    contacts: Contact[] = [];

    constructor(
        private toastService: ToastService,
        private translate: TranslateService
    ) {
        super();
    }

    /**
     * save Agence
     */
    save() {
        if (this.form.valid) {
            if (this.isEditMode()) {
                this.editEvent.emit(this.buildAgenceObject());
            } else {
                this.addEvent.emit(this.buildAgenceObject());
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * build Agence object
     */
    buildAgenceObject(): IAgenceModel {
        const agence: IAgenceModel = { ...this.form.value };
        agence.contacts = this.contacts;
        agence.adressesFacturation = this.adresseFacturation;
        agence.adressesLivraison = this.adresseLivraison;
        return agence;
    }

    /**
     * set address facturation
     */
    setAddressFacturation(address: Address[]) {
        this.adresseFacturation = address;
    }

    /**
     * set addresses livraison
     */
    setAddressLivraison(addresses: Address[]) {
        this.adresseLivraison = addresses;
    }

    /**
     * set contacts
     */
    setContacts(contacts: Contact[]) {
        this.contacts = contacts;
    }

    /**
     * set agence in form
     */
    setAgenceInForm(agence: IAgence) {
        this.form.setValue({
            reference: agence.reference,
            raisonSociale: agence.raisonSociale,
            formeJuridique: agence.formeJuridique,
            capital: agence.capital,
            numeroTvaINTRA: agence.numeroTvaINTRA,
            siret: agence.siret,
            email: agence.email,
            phoneNumber: agence.phoneNumber,
            codeComptable: agence.codeComptable,
            dateDebutActivite: agence.dateDebutActivite,
            dateFinActivite: agence.dateDebutActivite,
            regulationModeId: agence.regulationModeId
        });
        this.adresseFacturation = agence.adressesFacturation;
        this.contacts = agence.contacts;
        this.adresseLivraison = agence.adressesLivraison;
    }

}
