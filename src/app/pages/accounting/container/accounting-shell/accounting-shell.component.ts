import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'app/app-settings/app-settings';
import { AccountingTabs } from 'app/core/enums/accounting-tabs.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { FileHelper } from 'app/core/helpers/file';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IAccountJournalFilterOption, ISalesJournalFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { ColumnDataTable, ColumnType } from 'app/shared/data-table/data-table.component';
import { IAccountJournalModel, ISalesJournalModel } from '../../accounting.model';
import { AccountingService } from '../../accounting.service';

@Component({
    selector: 'kt-accounting-shell',
    templateUrl: './accounting-shell.component.html'
})
export class AccountingShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** columns sales journal */
    columnsSalesJournal: ColumnDataTable[] = [];

    /** columns bank   */
    columnsBankJournal: ColumnDataTable[] = [];

    /** sales journal filter options */
    initFilterOptionSales: ISalesJournalFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'dateCreation',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    /** account journal filter options */
    initFilterOptionsAccount: IAccountJournalFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'datePaiment',
        SortDirection: SortDirection.Desc,
        SearchQuery: ''
    };

    /** list of sales journal */
    salesJournal: IPagedResult<ISalesJournalModel>;

    /** list of account journal */
    accountsJournal: IPagedResult<IAccountJournalModel>;

    /** selected tabs */
    selectedTabs = AccountingTabs.Sales;

    /** Accounting tabs */
    accountingTabs = AccountingTabs;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private accountingService: AccountingService,
        protected toastService: ToastService,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Avoir);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
        this.setSalesColumns();
        this.setBankColumns();
    }

    //#region service

    /**
     * get list sales journal as paged result
     */
    getSalesJournal(filterOption: ISalesJournalFilterOption) {
        this.subs.sink = this.accountingService.GetSalesJournalAsPagedResult(filterOption).subscribe(result => {
            this.salesJournal = result;
        });
    }

    /**
     * get list account journal as paged result
     */
    getAccountJournal(filterOption: IAccountJournalFilterOption) {
        this.subs.sink = this.accountingService.GetAccountsJournalAsPagedResult(filterOption).subscribe(result => {
            this.accountsJournal = result;
        });
    }

    /**
     * export sales journal event
     */
    exportSalesJournalEvent(filterOption: ISalesJournalFilterOption) {
        this.subs.sink = this.accountingService.ExportSalesJournalExcel(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.downloadEXCEL(result.value, 'export_journal_vente');
            } else {
                this.toastErrorServer()
            }
        });
    }

    /**
     * export bank journal event
     */
    exportAccountJournalEvent(filterOption: IAccountJournalFilterOption) {
        this.subs.sink = this.accountingService.ExportAccountsJournalExcel(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                FileHelper.downloadEXCEL(result.value, 'export_journal_account');
            } else {
                this.toastErrorServer()
            }
        });
    }

    //#endregion

    //#region columns

    /** set sales columns */
    setSalesColumns() {
        this.columnsSalesJournal = [
            {
                name: 'codeJournal',
                nameTranslate: 'LABELS.CODE_JOURNAL',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'dateCreation',
                nameTranslate: 'LABELS.DATE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'numeroCompte',
                nameTranslate: 'LABELS.NUMERO_COMPTE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'numeroPiece',
                nameTranslate: 'LABELS.NUMERO_PIECE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'clientName',
                nameTranslate: 'LABELS.CLIENT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'debit',
                nameTranslate: 'LABELS.DEBIT',
                isOrder: true,
                type: ColumnType.Currency
            },
            {
                name: 'credit',
                nameTranslate: 'LABELS.CREDIT',
                isOrder: true,
                type: ColumnType.Currency
            }
        ];
    }

    /** set bank columns */
    setBankColumns() {
        this.columnsBankJournal = [
            {
                name: 'codeJournal',
                nameTranslate: 'LABELS.CODE_JOURNAL',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'datePaiment',
                nameTranslate: 'LABELS.DATE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'numeroCompte',
                nameTranslate: 'LABELS.NUMERO_COMPTE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'numeroPiece',
                nameTranslate: 'LABELS.NUMERO_PIECE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'tiers',
                nameTranslate: 'LABELS.TIERS',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'debit',
                nameTranslate: 'LABELS.DEBIT',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'credit',
                nameTranslate: 'LABELS.CREDIT',
                isOrder: true,
                type: ColumnType.Currency
            },
            {
                name: 'paimentMethod',
                nameTranslate: 'LABELS.PAYMENT_TYPE',
                isOrder: true,
                type: ColumnType.any
            }
        ];
    }

    //#endregion

}
