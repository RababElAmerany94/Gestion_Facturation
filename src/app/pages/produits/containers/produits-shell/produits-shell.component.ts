import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { ResultStatus } from 'app/core/enums/result-status';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import {
    IChangeVisibilityProduitModel, IProduit,
    IProduitModel, IPrixProduitParAgence,
    IPrixProduitParAgenceModel
} from '../../produits.model';
import { ProduitsService } from '../../produits.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StringHelper } from 'app/core/helpers/string';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { Memo } from 'app/core/models/general/memo.model';

@Component({
    selector: 'kt-produits-shell',
    templateUrl: './produits-shell.component.html'
})
export class ProduitsShellComponent extends BaseContainerTemplateComponent implements OnInit {

    /**
     * list produits
     */
    produits: IPagedResult<IProduit>;

    /**
     * the current produit
     */
    produit: IProduit;

    /**
     * the prix produit Agence
     */
    produitAgence: IPrixProduitParAgence;

    /**
     * the filter options
     */
    filterOption: IFilterOption;

    /**
     * the form of produit
     */
    form: FormGroup;

    /**
     * the form of prix produit par Agence
     */
    formAgence: FormGroup;

    /**
     * agence mode
     */
    isAgenceMode = false;

    constructor(
        protected translate: TranslateService,
        protected toastService: ToastService,
        protected router: Router,
        protected route: ActivatedRoute,
        private translateService: TranslationService,
        private produitService: ProduitsService,
        private fb: FormBuilder,
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Produits);
        this.subscribeRoute();
    }

    ngOnInit() {
        this.initializationForm();
        this.initializationAgenceForm();
        this.translateService.setLanguage(this.translate);
    }

    //#region routes

    /**
     * subscribe route
     */
    subscribeRoute() {
        this.route.queryParams.subscribe(result => {
            if (!StringHelper.isEmptyOrNull(result?.mode)) {
                const mode = parseInt(result.mode, 10) as ModeEnum;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        this.addEvent();
                        break;

                    case ModeEnum.Edit:
                        this.editEvent(result.id);
                        break;

                    case ModeEnum.Show:
                        this.showEvent(result.id);
                        break;
                }
            }
        });
    }

    //#endregion

    //#region form

    initializationForm() {
        this.form = this.fb.group({
            reference: [null, [Validators.required]],
            prixAchat: [null],
            prixHT: [0, [Validators.required]],
            tva: [20, [Validators.required]],
            description: [null, [Validators.required]],
            designation: [null],
            unite: [null],
            isPublic: [false],
            fournisseurId: [null],
            labels: [null],
            prixTTC: [0],
            categoryId: [null, [Validators.required]]
        });
    }

    /**
     * initialization Agence form
     */
    initializationAgenceForm() {
        this.formAgence = this.fb.group({
            prixHT: [0, [Validators.required]],
            tva: [20, [Validators.required]],
            prixTTC: [0]
        });
    }

    //#endregion

    // #region services

    /**
     * get produit as paged
     */
    getProduits(filterOption: IFilterOption) {
        this.subs.sink = this.produitService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.filterOption = filterOption;
                    this.produits = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get produit by id
     * @param id the id of entity produit
     */
    getProduitById(id: string, callback: (produit: IProduit) => void) {
        this.produitService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * add new produit
     */
    addProduit(produitModel: IProduitModel) {
        this.produitService.Add(produitModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.getProduits(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * edit produit
     */
    editProduit(produit: IProduitModel) {
        this.produitService.Update(this.produit.id, produit).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete produit
     */
    deleteEvent(id: string) {
        this.subs.sink = this.produitService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getProduits(this.filterOption);
                this.mode = this.modes.List;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * change visibility produit
     */
    changeVisibilityEvent(changeModel: IChangeVisibilityProduitModel) {
        this.subs.sink = this.produitService.ChangeVisibilityProduit(changeModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.updateVisibility(changeModel.id, result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * add new produit
     */
    addPrixProduitParPrixEvent(produitModel: IPrixProduitParAgenceModel) {
        produitModel.produitId = this.produit.id;
        this.produitService.AddPrixProduitParAgence(produitModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastAddSuccess();
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * edit produit
     */
    editPrixProduitParPrixEvent(produitModel: IPrixProduitParAgenceModel) {
        produitModel.produitId = this.produit.id;
        this.produitService.UpdatePrixProduitParAgence(this.produitAgence.id, produitModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    // #endregion

    // #region memos

    /**
     * add memo to produit object
     */
    saveMemoToProduit(memos: Memo[]) {
        this.subs.sink = this.produitService.SaveMemos(this.produit.id, memos).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastSaveSuccess();
                this.produit.memos = memos;
            }
        });
    }

    // #endregion

    // #region events

    addEvent() {
        this.isAgenceMode = false;
        this.produit = null;
        this.initializationForm();
        this.modeAdd();
    }

    editEvent(id: string) {
        this.isAgenceMode = false;
        this.getProduitById(id, (prod) => {
            this.produit = prod;
            this.initializationForm();
            this.modeEdit(id);
        });
    }

    showEvent(id: string) {
        this.isAgenceMode = false;
        this.getProduitById(id, (prod) => {
            this.produit = prod;
            this.initializationForm();
            this.modeShow(id);
        });
    }

    showAgenceEvent(id: string) {
        this.isAgenceMode = true;
        this.getProduitById(id, (prod) => {
            this.produit = prod;
            this.produitAgence = this.produit.prixProduitParAgences.length > 0 ? this.produit.prixProduitParAgences[0] : null;
            this.modeShow(id);
        });
    }

    editAgenceEvent(id: string) {
        this.isAgenceMode = true;
        this.getProduitById(id, (prod) => {
            this.produit = prod;
            this.produitAgence = this.produit.prixProduitParAgences.length > 0 ? this.produit.prixProduitParAgences[0] : null;
            this.modeEdit(id);
        });
    }

    // #endregion

    // #region helpers

    /**
     * update visibility
     */
    updateVisibility(produitId: string, isPublic: boolean) {
        const produitIndex = this.produits.value.findIndex(e => e.id === produitId);
        this.produits.value[produitIndex].isPublic = isPublic;
        this.produits = JSON.parse(JSON.stringify(this.produits));
    }

    // #endregion

}
