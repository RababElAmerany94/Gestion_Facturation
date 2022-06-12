import { Component, OnInit } from '@angular/core';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { IBankAccount } from 'app/pages/parametres/bank-account/bank-account.model';
import { BankAccountService } from 'app/pages/parametres/bank-account/bank-account.service';
import { SortDirection } from 'app/core/enums/sort-direction';
import { AppSettings } from 'app/app-settings/app-settings';

@Component({
    selector: 'kt-bank-account-drop-down',
    template: `
    <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
        <mat-label>{{label}}</mat-label>
        <mat-select [id]="inputName" [formControlName]="inputName" (selectionChange)="changeSelect($event.value)">
            <mat-option *ngFor="let item of bankAccounts" [value]="item?.id">
            {{item?.name}}
            </mat-option>
        </mat-select>
    </mat-form-field>
`
})
export class BankAccountDropDownComponent extends BaseCustomUiComponent implements OnInit {

    /** the list mode regulation mode */
    bankAccounts: IBankAccount[] = [];
    constructor(private bankAccountService: BankAccountService) {
        super();
    }

    ngOnInit() {
        this.getBankAccount();
    }
    /**
     * change select bank account
     */
    changeSelect(BankAccountId: string) {
        if (BankAccountId != null) {
            this.changeEvent.emit(this.bankAccounts.find(e => e.id === BankAccountId));
        } else {
            this.changeEvent.emit(null);
        }
    }
    /**
     * get list bank accounts
     */
    getBankAccount() {
        this.bankAccountService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'name',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            this.bankAccounts = result.value;
        });
    }
}
