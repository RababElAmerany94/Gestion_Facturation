import { StringHelper } from './../../../../../core/helpers/string';
import { EditBankAccountComponent } from './../../components/edit-bank-account/edit-bank-account.component';
import { MatDialog } from '@angular/material/dialog';
import { IBankAccountModel } from './../../bank-account.model';
import { Component, OnInit } from '@angular/core';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IBankAccount } from '../../bank-account.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { TranslateService } from '@ngx-translate/core';
import { BankAccountService } from '../../bank-account.service';
import { ResultStatus } from 'app/core/enums/result-status';
import { BankAccountType } from 'app/core/enums/bank-account.enum';
import { UserHelper } from 'app/core/helpers/user';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { DialogHelper } from 'app/core/helpers/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'kt-bank-account-shell',
    templateUrl: './bank-account-shell.component.html'
})
export class BankAccountShellComponent extends BaseContainerTemplateComponent implements OnInit {

    bankAccounts: IPagedResult<IBankAccount>;
    bankAccount: IBankAccount;
    form: FormGroup;
    filterOption: IFilterOption;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        protected toastService: ToastService,
        private dialogMat: MatDialog,
        private fb: FormBuilder,
        private bankAccountService: BankAccountService,
        protected router: Router
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.BankAccount);
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    /**
     * initForm
     */
    InitForm() {
        this.form = this.fb.group({
            name: [null, [Validators.required]],
            codeComptable: [null, [Validators.required]],
            isModify: [true]
        });
    }

    // #region service
    /**
     * get banq account as page
     */
    getBankAccounts(filterOption: IFilterOption) {
        this.subs.sink = this.bankAccountService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.filterOption = filterOption;
                    this.bankAccounts = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * add new bank account
     */
    addBankAccount(bankAccountModel: IBankAccountModel) {
        bankAccountModel.type = BankAccountType.CompteBancaire;
        bankAccountModel.agenceId = UserHelper.getAgenceId();
        this.bankAccountService.Add(bankAccountModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.getBankAccounts(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });

    }
    /**
     * edit banqAccount
     */
    editBankAccount(bankAccountModel: IBankAccountModel) {
        this.bankAccountService.Update(this.bankAccount.id, bankAccountModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.getBankAccounts(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    // #endregion

    // #region event

    /**
     * delete category product
     */
    deleteBankAccount(id: string) {
        this.subs.sink = this.bankAccountService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getBankAccounts(this.filterOption);
                this.mode = ModeEnum.List;
            } else {
                this.toastErrorServer();
            }
        });
    }

    // #endregion


    // #region events

    addEvent() {
        this.bankAccount = null;
        this.InitForm();
        DialogHelper.openDialog(this.dialogMat, EditBankAccountComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Add
        }).subscribe(result => {
            if (result !== null && result !== '') {
                this.addBankAccount(result);
            }
        });
    }

    editEvent(bankAccount: IBankAccount) {
        this.bankAccount = this.bankAccounts.value.find(e => e.id === bankAccount.id);
        this.InitForm();
        DialogHelper.openDialog(this.dialogMat, EditBankAccountComponent, DialogHelper.SIZE_SMALL, {
            form: this.form,
            mode: ModeEnum.Edit,
            bankAccount: this.bankAccount
        }).subscribe((result) => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.editBankAccount(result);
            }
        });
    }

}
