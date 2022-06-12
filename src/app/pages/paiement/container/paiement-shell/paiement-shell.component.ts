import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IPaiement, IPaiementModel, IPaiementGroupeObligeModel } from '../../paiement.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IFilterOption, IPaimentFilterOption } from 'app/core/models/general/filter-option.model';
import { ReferenceResultModel } from 'app/core/models/general/reference-result-model';
import { TranslationService } from 'app/core/layout';
import { PaiementService } from '../../paiement.service';
import { ToastService } from 'app/core/layout/services/toast.service';
import { ResultStatus } from 'app/core/enums/result-status';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { MouvementCompteACompteComponent } from '../../components/mouvement-compte-acompte/mouvement-compte-acompte.component';
import { PaiementGroupComponent } from '../../components/paiement-group/paiement-group.component';
import { ModeEnum } from 'app/core/enums/mode.enum';

@Component({
    selector: 'kt-paiement-shell',
    templateUrl: './paiement-shell.component.html'
})
export class PaiementShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /** the form group */
    form: FormGroup;

    /** the current paiement */
    paiement: IPaiement;

    /** list of paiements */
    paiements: IPagedResult<IPaiement>;

    /** filter option */
    filterOption: IFilterOption;

    /** the current reference */
    currentReference: ReferenceResultModel;

    /**
     * the current balance
     */
    currentBalance = 0;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private fb: FormBuilder,
        private paiementService: PaiementService,
        protected toastService: ToastService,
        private dialogMat: MatDialog,
        private route: ActivatedRoute,
        protected router: Router,
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Paiement);
        this.subscribeRouteChanges();
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    //#region route

    /**
     * subscribe route changes
     */
    subscribeRouteChanges() {
        this.route.queryParams.subscribe(queryParams => {
            if (!StringHelper.isEmptyOrNull(queryParams?.mode)) {
                const mode = parseInt(queryParams.mode, 10) as ModeEnum;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Show:
                        this.showEvent(queryParams.id);
                        break;
                }
            }
        });
    }

    //#endregion

    //#region form

    initializeForm() {
        this.form = this.fb.group({
            montant: [null, [Validators.required]],
            bankAccountId: [null],
            datePaiement: [null, [Validators.required]],
            type: [null],
            regulationModeId: [null],
            description: [null],
            createAvoir: [false],
            dateFrom: [null],
            dateTo: [null]
        });
    }

    //#endregion

    //#region services

    /**
     * get paiments as paged results
     * @param filterOption the filter option
     */
    getPaiements(filterOption: IPaimentFilterOption) {
        this.subs.sink = this.paiementService.GetAsPagedResult(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.filterOption = filterOption;
                this.paiements = result;
                this.getCurrentBalance(filterOption);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get current balance
     * @param filterOption the filter option
     */
    getCurrentBalance(filterOption: IPaimentFilterOption) {
        this.subs.sink = this.paiementService.GetTotalPayments(filterOption).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.filterOption = filterOption;
                this.currentBalance = result.value;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * add new paiement
     */
    addPaiement(paiementModel: IPaiementModel) {
        this.paiementService.Add(paiementModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.getPaiements(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }

        });
    }

    /**
     * movement paiement compte a compte
     */
    MouvementCompteACompte(body: { compteDebitId: string, creditAccountId: string, montant: number, description: string }) {
        this.paiementService.MovementCompteToCompte(body).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.getPaiements(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }

        });
    }

    /**
     * edit paiement
     */
    editPaiement(paiementModel: IPaiementModel) {
        this.paiementService.Update(this.paiement.id, paiementModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get paiement by id
     * @param id the id of paiement
     */
    getPaymentById(id: string) {
        this.subs.sink = this.paiementService.Get(id)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.paiement = result.value;
                    this.initializeForm();
                    this.form.disable();
                    this.modeShow(id);
                } else {
                    this.toastErrorServer();
                }

            });
    }

    /**
     * delete paiement
     */
    deletePaiement(id: string) {
        this.subs.sink = this.paiementService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getPaiements(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * paiement group oblige
     */
    paiementGroupeOblige(model: IPaiementGroupeObligeModel) {
        this.subs.sink = this.paiementService.PaiementGroupeOblige(model).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.getPaiements(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    //#endregion

    //#region event

    /** event paiement group  */
    addPaiementGroupEvent() {
        this.initializeForm();
        DialogHelper.openDialog(this.dialogMat, PaiementGroupComponent, DialogHelper.SIZE_LARGE, {
            form: this.form
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                if (result.montant != null) {
                    this.addPaiement(result);
                } else {
                    this.paiementGroupeOblige(result);
                }
            }
        });
    }

    /** event mouvement compte a compte */
    MouvementCompteAcompteEvent() {
        DialogHelper.openDialog(this.dialogMat, MouvementCompteACompteComponent, DialogHelper.SIZE_MEDIUM, {
        }).subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result)) {
                this.MouvementCompteACompte(result);
            }
        });
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getPaymentById(id);
    }

    //#endregion

}
