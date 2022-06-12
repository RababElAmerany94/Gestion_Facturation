import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { TranslationService } from 'app/core/layout';
import { DialogOptions } from 'app/core/models/general/alert-options';
import { Address, IAddressModel } from '../../core/models/general/address.model';
import { ConfigDialogComponent } from '../ui-material-elements/config-dialog/config-dialog.component';
import { IClient } from './../../pages/clients/client.model';
import { AddAddressDropdownComponent } from './add-address-dropdown/add-address-dropdown.component';
import { AddAddressComponent } from './add-address/add-address.component';

@Component({
    selector: 'kt-addresses',
    templateUrl: './addresses.component.html'
})
export class AddressesComponent implements OnInit {

    @Output()
    changeAddress = new EventEmitter();
    @Input()
    addresses: Address[] = [];
    @Input()
    mode: ModeEnum;
    @Input()
    title = 'ADDRESS.TITLE';
    @Input()
    isForAgenda: false;
    @Input()
    client: IClient;

    modes = ModeEnum;

    constructor(
        public dialog: MatDialog,
        private translate: TranslateService,
        private translationService: TranslationService) { }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    /**
     * open add address dialog
     */
    addAddressDialog(): void {
        const data = { title: 'ADDRESS.ADD_ADDRESS', showIsDefault: true };
        DialogHelper
            .openDialog(this.dialog, AddAddressComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe((result: IAddressModel) => {
                if (result) {
                    if (result.isDefault) { this.updateIsDefaultAddress(); }
                    if (this.addresses.length === 0) {
                        result.isDefault = true;
                    }
                    this.addresses.push(result);
                    this.emitChange();
                }
            });
    }

    /**
     * open add address dialog
     */
    addAddressDialogDropdown(): void {
        const data = { adresse: this.client?.addresses };
        DialogHelper
            .openDialog(this.dialog, AddAddressDropdownComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe((result: IAddressModel) => {
                if (result) {
                    if (result.isDefault) { this.updateIsDefaultAddress(); }
                    if (this.addresses.length === 0) {
                        result.isDefault = true;
                    }
                    this.addresses.push(result);
                    this.emitChange();
                }
            });
    }

    /**
     * open edit address dialog
     * @param index the index of address to edit
     */
    editAddressDialog(index: number) {
        const data = {
            address: this.addresses[index],
            showIsDefault: true,
            title: 'ADDRESS.EDIT_ADDRESS',
        };
        DialogHelper
            .openDialog(this.dialog, AddAddressComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe(result => {
                if (result) {
                    if (result.isDefault) { this.updateIsDefaultAddress(); }
                    this.addresses[index] = result;
                    this.emitChange();
                }
            });
    }

    /**
     * delete address by index
     * @param addressIndex the index of address to delete
     */
    deleteAddress(addressIndex: number) {
        const options: DialogOptions = {
            header: this.translate.instant('ADDRESS.DELETE.HEADER_TEXT'),
            message: this.translate.instant('ADDRESS.DELETE.QUESTION'),
            buttons: [
                {
                    text: this.translate.instant('LABELS.CANCEL'),
                    handler: () => { },
                    cssClass: 'warn',
                },
                {
                    text: this.translate.instant('LABELS.CONFIRM_DELETE_LE'),
                    cssClass: 'primary',
                    handler: () => {
                        this.addresses.splice(addressIndex, 1);
                        this.emitChange();
                    }
                }
            ]
        };
        DialogHelper.openAlertDialog(this.dialog, options, ConfigDialogComponent);
    }

    /**
     * when we set an address as default we need to update another to be not default address
     */
    updateIsDefaultAddress() {
        if (this.addresses !== undefined || this.addresses !== null) {
            this.addresses.map(e => e.isDefault = false);
        }
    }

    /**
     * emit changes
     */
    emitChange() {
        this.changeAddress.emit(this.addresses);
    }

}
