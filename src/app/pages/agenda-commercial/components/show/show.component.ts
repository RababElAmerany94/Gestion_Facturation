import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EchangeCommercialStatus } from 'app/core/enums/echange-commercial-status.enum';
import { Address } from 'app/core/models/general/address.model';
import { AgendaCommercialHelper } from '../../agenda-commercial-helper';
import { EchangeCommercialType } from '../../../../core/enums/echange-commercial-type.enum';
import { Contact } from '../../../../core/models/contacts/contact';
import { BaseEditTemplateComponent } from '../../../../shared/base-features/base-edit.component';
import { IMatMenuItem } from '../../../../shared/ui-material-elements/custom-mat-menu/custom-mat-menu.component';
import { IEchangeCommercial, IEchangeCommercialModel } from '../../agenda-commercial.model';

@Component({
    selector: 'kt-agenda-commercial-show',
    templateUrl: './show.component.html',
    styles: ['.table th, .table td { padding: 0.3rem 0 !important; }']
})
export class AgendaCommercialShowComponent extends BaseEditTemplateComponent<IEchangeCommercialModel> implements OnInit {

    /** save memo */
    @Output()
    saveMemo = new EventEmitter<string>();

    /** change status event */
    @Output()
    changeStatusEvent = new EventEmitter();

    /** save address event */
    @Output()
    saveAddresseEvent = new EventEmitter();

    /** save contact event */
    @Output()
    saveContactEvent = new EventEmitter();

    /** types agenda commercial data */
    @Input() set Data(val: IEchangeCommercial) {
        if (val != null) {
            this.echangeCommercial = val;
            this.menuItems = this.getMenuItems();
            if (val.contacts != null) {
                this.contacts = val.contacts as Contact[];
            }
            if (val.addresses != null) {
                this.address = val.addresses as Address[];
            }
        }
        this.form.disable();
    }

    /** types agenda commercial */
    types = EchangeCommercialType;

    /** types echange commercial */
    echangeCommercial: IEchangeCommercial;

    /** the title of pop up */
    title: string;

    menuItems: IMatMenuItem[] = [];

    /** the site intervention */
    address: Address[] = [];

    /** the contact */
    contacts: Contact[] = [];

    constructor(
    ) {
        super();
    }

    ngOnInit(): void {
        this.title = this.getTitle(this.getNameType(this.echangeCommercial.type));
    }

    /**
     * title of pop up
     */
    getTitle(name: string) {
        return `${name}.SHOW_TITLE`;
    }

    /**
     * name of pop up
     */
    getNameType(type: EchangeCommercialType) {
        switch (type) {
            case EchangeCommercialType.Appel:
                return 'APPELS';

            case EchangeCommercialType.RDV:
                return 'RENDEZ-VOUS';

            case EchangeCommercialType.Tache:
                return 'TACHE';
        }
    }

    /**
     * set addresses
     */
    setAddress(address: Address[]) {
        if (address) {
            this.address = address;
            this.saveAddresseEvent.emit(this.address);
        }
    }

    /**
     * set addresses
     */
    setContact(contact: Contact[]) {
        this.contacts = contact;
        this.saveContactEvent.emit(this.contacts);
    }
    //#region helpers

    /**
     * menu items of actions
     */
    getMenuItems() {
        const items: IMatMenuItem[] = [
            {
                appear: !AgendaCommercialHelper.isStatusCloture(this.echangeCommercial.status),
                action: () => this.changeStatusEvent.emit(EchangeCommercialStatus.cloturee),
                icon: 'assignment_turned_in',
                title: 'LABELS.CLOTURE'
            },
            {
                appear: !AgendaCommercialHelper.isStatusAnnulee(this.echangeCommercial.status),
                action: () => this.changeStatusEvent.emit(EchangeCommercialStatus.annulee),
                icon: 'cancel',
                title: 'LABELS.CANCEL'
            },
        ];
        return items;
    }

    //#endregion
}
