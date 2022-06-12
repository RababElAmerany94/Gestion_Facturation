import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from 'app/app-settings/app-settings';
import { ResultStatus } from 'app/core/enums/result-status';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { IFournisseur, IFournisseurModel } from '../../suppliers';
import { SuppliersService } from '../../suppliers.service';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { StringHelper } from 'app/core/helpers/string';

@Component({
    selector: 'kt-suppliers',
    templateUrl: './suppliers.component.html',
})
export class SuppliersComponent extends BaseContainerTemplateComponent implements OnInit {

    /** list of suppliers */
    suppliers: IPagedResult<IFournisseur>;

    /** the current supplier */
    supplier: IFournisseur;

    /** the filter option */
    filterOption: IFilterOption;

    /** the form of supplier */
    form: FormGroup;

    constructor(
        private translationService: TranslationService,
        private supplierService: SuppliersService,
        private fb: FormBuilder,
        protected translate: TranslateService,
        private numerationService: NumerationService,
        protected toastService: ToastService,
        protected router: Router,
        private route: ActivatedRoute
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Fournisseurs);
        this.initializeForm();
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
        this.subscribeRoute();
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

    /**
     * initialize form
     */
    initializeForm() {
        this.form = this.fb.group({
            reference: [null, [Validators.required]],
            raisonSociale: [null, [Validators.required]],
            siret: [null, [Validators.required]],
            phoneNumber: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.pattern(AppSettings.regexEmail)]],
            webSite: [null, [Validators.required]],
            codeComptable: [null, [Validators.required]],
        });
    }

    //#region services

    /**
     * display suppliers by filter
     */
    getSuppliers(filter: IFilterOption) {
        this.supplierService.GetAsPagedResult(filter).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.suppliers = result;
                this.filterOption = filter;
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * get supplier by id
     * @param id the id of entity supplier
     */
    getSupplierById(id: string, callback: (fournisseur: IFournisseur) => void) {
        this.supplierService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * generate reference agence
     */
    generateReference() {
        this.subs.sink = this.numerationService
            .GenerateNumerotation(NumerationType.FOURNISSEUR)
            .subscribe(item => {
                if (item.status === ResultStatus.Succeed) {
                    this.form.get('reference').setValue(item.value);
                }
            });
    }

    /**
     * check username and password are unique
     * @param callback the callback
     */
    CheckReferenceIsUnique(supplierModel: IFournisseurModel, isAdd: boolean, callback) {
        this.subs.sink = this.supplierService.IsUniqueReference(supplierModel.reference).subscribe((result) => {
            if (result.status === ResultStatus.Succeed &&
                !result.value &&
                (isAdd ? true : this.supplier.reference !== supplierModel.reference)) {
                this.toastService.error(this.translate.instant('ERRORS.REFERENCE_NOT_UNIQUE'));
                callback(false);
                return;
            }
            callback(true);
        });
    }

    /**
     * add supplier
     */
    addSupplier(supplierModel: IFournisseurModel) {
        this.CheckReferenceIsUnique(supplierModel, true, (checkResult: boolean) => {
            if (checkResult) {
                this.supplierService.Add(supplierModel).subscribe(result => {
                    if (result.hasValue) {
                        this.toastAddSuccess();
                        this.getSuppliers(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * delete supplier by id
     */
    deleteSupplier(id: string) {
        this.supplierService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getSuppliers(this.filterOption);
                this.modeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * update supplier
     */
    updateSupplier(supplierModel: IFournisseurModel) {
        this.CheckReferenceIsUnique(supplierModel, false, (checkResult: boolean) => {
            if (checkResult) {
                this.supplierService.Update(this.supplier.id, supplierModel).subscribe(result => {
                    if (result.hasValue) {
                        this.toastEditSuccess();
                        this.getSuppliers(this.filterOption);
                        this.modeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    //#endregion

    //#region events

    /**
     * add event
     */
    addEvent() {
        this.supplier = null;
        this.initializeForm();
        this.generateReference();
        this.modeAdd();
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getSupplierById(id, (supplier) => {
            this.supplier = supplier;
            this.initializeForm();
            this.modeShow(id);
        });
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getSupplierById(id, (supplier) => {
            this.supplier = supplier;
            this.initializeForm();
            this.modeEdit(id);
        });
    }

    //#endregion

}
