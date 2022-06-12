import { TranslateService } from '@ngx-translate/core';
import { Component, Input } from '@angular/core';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { Contact } from 'app/core/models/contacts/contact';
import { Address } from 'app/core/models/general/address.model';
import { IFournisseur, IFournisseurModel } from '../../suppliers';
import { ToastService } from './../../../../core/layout/services/toast.service';
import { UserHelper } from 'app/core/helpers/user';

@Component({
    selector: 'kt-supplier-edit',
    templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditTemplateComponent<IFournisseurModel> {


    @Input() set supplier(supplier: IFournisseur) {
        if (supplier != null) {
            this.setSuppliersForm(supplier);
        }
        if (this.isShowMode()) {
            this.form.disable();
        }
    }

    /** the list of address */
    address: Address[] = [];

    /** the list of contacts */
    contacts: Contact[] = [];

    constructor(
        private toastService: ToastService,
        private translate: TranslateService) {
        super();
    }

    /**
     * set supplier in form
     */
    setSuppliersForm(fournisseur: IFournisseur) {
        this.form.get('reference').setValue(fournisseur.reference);
        this.form.get('raisonSociale').setValue(fournisseur.raisonSociale);
        this.form.get('siret').setValue(fournisseur.siret);
        this.form.get('phoneNumber').setValue(fournisseur.phoneNumber);
        this.form.get('email').setValue(fournisseur.email);
        this.form.get('webSite').setValue(fournisseur.webSite);
        this.form.get('codeComptable').setValue(fournisseur.codeComptable);
        this.contacts = fournisseur.contacts as Contact[];
        this.address = fournisseur.addresses as Address[];
    }

    /**
     * build fournisseur object
     */
    buildSupplierObject(): IFournisseurModel {
        const fournisseurModel = { ...this.form.value };
        fournisseurModel.contacts = this.contacts;
        fournisseurModel.addresses = this.address;
        fournisseurModel.agenceId = UserHelper.getAgenceId();
        return fournisseurModel;
    }

    /**
     * save fournisseur
     */
    save() {
        if (this.form.valid) {
            if (this.isAddMode()) {
                this.addEvent.emit(this.buildSupplierObject());
            } else {
                this.editEvent.emit(this.buildSupplierObject());
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * address
     */
    setAddress(address: Address[]) {
        if (address) {
            this.address = address;
        }
    }

    /**
     * contacts
     */
    setContact(contacts: Contact[]) {
        if (contacts) {
            this.contacts = contacts;
        }
    }

}
