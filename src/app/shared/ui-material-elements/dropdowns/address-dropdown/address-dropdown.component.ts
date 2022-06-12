import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArrayHelper } from 'app/core/helpers/array';
import { DialogHelper } from 'app/core/helpers/dialog';
import { ObjectHelper } from 'app/core/helpers/object';
import { StringHelper } from 'app/core/helpers/string';
import { Address, IAddressModel } from 'app/core/models/general/address.model';
import { AddAddressComponent } from 'app/shared/addresses/add-address/add-address.component';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';

@Component({
    selector: 'kt-address-dropdown',
    template: `
        <mat-form-field appearance="fill" class="example-full-width" [formGroup]="formInstant">
            <mat-label>{{label}}</mat-label>
            <mat-select
                [id]="inputName"
                [formControlName]="inputName"
                (selectionChange)="changeSelect($event.value)">
                    <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
                    <mat-option *ngFor="let item of _addresses;let i=index" [value]="i">
                        {{ buildPhraseAddress(item)}}
                    </mat-option>
            </mat-select>
            <button mat-icon-button
                    matSuffix
                    *ngIf="!readOnly"
                    (click)="addAddressDialog($event)"
                    [matTooltip]="'LABELS.ADD' | translate" >
                <mat-icon>add</mat-icon>
            </button>
        </mat-form-field>
    `
})
export class AddressDropDownComponent extends BaseCustomUiComponent {

    /** emit change selection */
    @Output()
    changeEvent = new EventEmitter<Address>();

    /** the label of form */
    @Input()
    label: string;

    /** set address format JSON */
    @Input()
    set addresses(address: Address[]) {
        if (!ArrayHelper.isEmptyOrNull(address)) {
            this._addresses = address;
        }
    }

    @Input()
    set selectedAddress(value: Address) {
        if (!ObjectHelper.isNullOrEmpty(value)) {
            this.selectAddress(value);
        }
    }

    @Input()
    readOnly = false;

    /** the list of addresses */
    _addresses: Address[] = [];

    constructor(
        private dialog: MatDialog
    ) {
        super();
    }

    /**
     * build phrase base to address object
     */
    buildPhraseAddress(address: Address) {
        return [
            address.adresse,
            address.complementAdresse,
            `${address.ville} ${address.codePostal}`,
            address.departement,
            address.pays
        ].join(', ').replace('null', '');
    }

    /**
     * change selection
     */
    changeSelect(index: number) {
        this.changeEvent.emit(this._addresses[index]);
    }

    /**
     * open add address dialog
     */
    addAddressDialog(event): void {
        event.stopPropagation();
        const data = { title: 'ADDRESS.TITLE_SITE_INTERVENTION', showIsDefault: true, showNew: true };
        DialogHelper.openDialog(this.dialog, AddAddressComponent, DialogHelper.SIZE_MEDIUM, data)
            .subscribe((result) => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    const addressModel: IAddressModel = { ...result, isNew: true };
                    this._addresses.push(addressModel);
                    const index = this._addresses.length - 1;
                    this.changeSelect(index);
                    this.setSelected(index);
                }
            });
    }

    /**
     * select address
     * @param address the address to select
     */
    selectAddress(address: Address) {
        const addressIndex = this._addresses
            .findIndex(e =>
                e.departement === address.departement &&
                e.ville === address.ville &&
                e.pays === address.pays
            );

        if (addressIndex >= 0) {
            this.setSelected(addressIndex);
        } else {
            if (address.adresse != null) {
                this._addresses.push(address);
                this.setSelected(this._addresses.length - 1);
            }
        }
    }

    setSelected(index: number) {
        this.formInstant.get(this.inputName).setValue(index);
    }

}
