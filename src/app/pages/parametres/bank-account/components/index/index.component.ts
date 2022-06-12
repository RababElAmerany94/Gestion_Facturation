import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IBankAccount, IBankAccountDataTables } from './../../bank-account.model';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';

@Component({
    selector: 'kt-index-compte-bancaire',
    templateUrl: './index.component.html'
})
export class IndexBankAccountComponent extends BaseIndexTemplateComponent<IBankAccountDataTables, string> implements OnInit {

    @Input() set data(data: IPagedResult<IBankAccount>) {
        if (data != null) {
            this.bankAccounts = { ...data as IPagedResult<any> };
            this.bankAccounts.value = data.value.map(e => this.mapIbankAccountDataTable(e));
        }
    }

    bankAccounts: IPagedResult<IBankAccountDataTables>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog) {
        super();
        this.setModule(this.modules.BankAccount);
    }

    ngOnInit() {
        this.setColumns();
    }

    /**
     * set columns
     */
    setColumns() {
        this.columns = [
            {
                name: 'name',
                nameTranslate: 'LABELS.FIRSTNAME',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'codeComptable',
                nameTranslate: 'LABELS.CODE_COMPTABLE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'type',
                nameTranslate: 'LABELS.TYPE',
                isOrder: true,
                type: ColumnType.Translate
            },

        ];
    }


    /**
     * delete button click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('BANK_ACCOUNT.DELETE.HEADER'),
            message: this.translate.instant('BANK_ACCOUNT.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    /**
     * map table bank account
     */
    mapIbankAccountDataTable(bankAccount: IBankAccount): IBankAccountDataTables {
        const bankAccountDataTable: IBankAccountDataTables = {
            id: bankAccount.id,
            name: bankAccount.name,
            codeComptable: bankAccount.codeComptable,
            type: `COMPTE_TYPE.${bankAccount.type}`,
            isModify: bankAccount.isModify
        };
        return bankAccountDataTable;
    }

}
