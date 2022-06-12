import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserHelper } from 'app/core/helpers/user';
import { ToastService } from 'app/core/layout/services/toast.service';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import {
    IAvoirDocumentParameters,
    IBonCommandeParameters,
    IDevisParameters,
    IDocumentParameters,
    IDocumentParametersModel,
    IFactureDocumentParameters,
    ITvaModel,
    ITvaParameters
} from '../../document-parameter.model';
import { DevisService } from 'app/pages/devis/devis.service';
import { FileHelper } from 'app/core/helpers/file';
import { ResultStatus } from 'app/core/enums/result-status';
import { FactureService } from 'app/pages/facture/facture.service';
import { AvoirService } from 'app/pages/avoir/avoir.service';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { ValidateDocumentParameter } from 'app/core/enums/validate-document-parameter.enum';
import { BonCommandeService } from 'app/pages/bon-commande/bon-commande.service';

@Component({
    selector: 'kt-edit-document-params',
    templateUrl: './edit.component.html',
})
export class EditComponent extends BaseEditTemplateComponent<IDocumentParametersModel> implements OnInit {

    @Input() set documentParameter(data: IDocumentParameters) {
        if (data != null) {
            this.setData(data);
            this.documentParametrage = data;
        }
    }

    /** form Tva */
    formTva: FormGroup;

    /** form Facture */
    formFacture: FormGroup;

    /** form Avoir */
    formAvoir: FormGroup;

    /** form devis */
    formDevis: FormGroup;

    /** form bon commande */
    formBonCommande: FormGroup;

    /** form add Tva */
    formAddTva: FormGroup;

    /** tva parameter */
    tvaParameter: any;

    /** tva model */
    tvaModels: ITvaModel[] = [];

    /** document paramter */
    documentParametrage: IDocumentParameters;

    /** display facture data */
    displayFactureData: string;

    /** display facture data */
    displayAvoirData: string;

    /** display devis data */
    displayDevisData: string;

    /** display bon de commande data */
    displayBonCommandeData: string;

    /** delay de validité */
    validateDelay: IDropDownItem<string, string>[];

    constructor(
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService,
        private devisService: DevisService,
        private avoirService: AvoirService,
        private factureService: FactureService,
        private bonCommandeService: BonCommandeService,
    ) {
        super();
        this.initializeForm();
    }

    ngOnInit() {
        this.setValidateDelay();
        this.visualizationPDFDevis();
        this.visualizationPDFAvoir();
        this.visualizationPDFFacture();
        this.visualizationPDFBonCommande();
    }

    //#region form

    initializeForm() {
        this.factureForm();
        this.devisForm();
        this.avoirForm();
        this.bonCommandeForm();
        this.tvaForm();
    }

    private tvaForm() {
        this.formTva = this.fb.group({
            defaultValue: [null, [Validators.required]],
            rootAccountingCode: [null, Validators.required]
        });
        this.formAddTva = this.fb.group({
            value: [null, [Validators.required]],
            accountingCode: [null, [Validators.required]]
        });
    }

    private avoirForm() {
        this.formAvoir = this.fb.group({
            validateDelay: [null],
            header: [null],
            footer: [null],
            note: [null],
            regulationCondition: [null]
        });
    }

    private devisForm() {
        this.formDevis = this.fb.group({
            sujetMail: [null],
            contenuMail: [null],
            header: [null],
            footer: [null],
            validateDelay: [null],
            note: [null]
        });
    }

    private factureForm() {
        this.formFacture = this.fb.group({
            validateDelay: [null],
            sujetMail: [null],
            contenuMail: [null],
            sujetRelance: [null],
            contenuRelance: [null],
            header: [null],
            footer: [null],
            note: [null],
            regulationCondition: [null]
        });
    }

    private bonCommandeForm() {
        this.formBonCommande = this.fb.group({
            sujetMail: [null],
            contenuMail: [null],
            header: [null],
            footer: [null],
            validateDelay: [null],
            note: [null]
        });
    }

    /**
     * set data
     */
    private setData(documentParametrage: IDocumentParameters) {

        const facture = documentParametrage.facture as IFactureDocumentParameters;
        const avoir = documentParametrage.avoir as IAvoirDocumentParameters;
        const tva = documentParametrage.tva as ITvaParameters;
        const devis = documentParametrage.devis as IDevisParameters;
        const bonCommande = documentParametrage.bonCommande as IBonCommandeParameters;

        this.setFactureFormData(facture);
        this.setAvoirFormData(avoir);
        this.setTvaFormData(tva);
        this.setDevisFormData(devis);
        this.setBonCommandeFormData(bonCommande);

    }

    private setDevisFormData(devis: IDevisParameters) {
        if (devis != null) {
            this.formDevis.setValue({
                validateDelay: devis.validateDelay ? devis.validateDelay : null,
                sujetMail: devis.sujetMail ? devis.sujetMail : null,
                contenuMail: devis.contenuMail ? devis.contenuMail : null,
                header: devis.header ? devis.header : null,
                footer: devis.footer ? devis.footer : null,
                note: devis.note ? devis.note : null
            });
        }
    }

    private setBonCommandeFormData(bonCommande: IBonCommandeParameters) {
        if (bonCommande != null) {
            this.formBonCommande.setValue({
                validateDelay: bonCommande.validateDelay ? bonCommande.validateDelay : null,
                sujetMail: bonCommande.sujetMail ? bonCommande.sujetMail : null,
                contenuMail: bonCommande.contenuMail ? bonCommande.contenuMail : null,
                header: bonCommande.header ? bonCommande.header : null,
                footer: bonCommande.footer ? bonCommande.footer : null,
                note: bonCommande.note ? bonCommande.note : null
            });
        }
    }

    private setTvaFormData(tva: ITvaParameters) {
        if (tva != null) {
            this.formTva.setValue({
                defaultValue: tva.defaultValue ? tva.defaultValue : null,
                rootAccountingCode: tva.rootAccountingCode ? tva.rootAccountingCode : null,
            });
            this.tvaModels = tva.list ? tva.list : [];
        }
    }

    private setAvoirFormData(avoir: IAvoirDocumentParameters) {
        if (avoir != null) {
            this.formAvoir.setValue({
                validateDelay: avoir.validateDelay ? avoir.validateDelay : null,
                header: avoir.header ? avoir.header : null,
                note: avoir.note ? avoir.note : null,
                footer: avoir.footer ? avoir.footer : null,
                regulationCondition: avoir.regulationCondition ? avoir.regulationCondition : null
            });
        }
    }

    private setFactureFormData(facture: IFactureDocumentParameters) {
        if (facture != null) {
            this.formFacture.setValue({
                validateDelay: facture.validateDelay ? facture.validateDelay : null,
                sujetMail: facture.sujetMail ? facture.sujetMail : null,
                contenuMail: facture.contenuMail ? facture.contenuMail : null,
                sujetRelance: facture.sujetRelance ? facture.sujetRelance : null,
                contenuRelance: facture.contenuRelance ? facture.contenuRelance : null,
                header: facture.header ? facture.header : null,
                footer: facture.footer ? facture.footer : null,
                note: facture.note ? facture.note : null,
                regulationCondition: facture.regulationCondition ? facture.regulationCondition : null
            });
        }
    }

    //#endregion

    //#region services

    /**
     * save document parametres TVA
     */
    save() {
        if (this.formTva.valid) {
            if (this.documentParametrage != null) {
                this.editEvent.emit(this.buildDocumentParamsObject());
            } else {
                this.addEvent.emit(this.buildDocumentParamsObject());
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.formTva.markAllAsTouched();
        }
    }

    /**
     * visualize pdf facture example
     */
    visualizationPDFFacture() {
        this.factureService
            .ExampleGeneratePDF(this.buildDocumentParamsObject())
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.displayFactureData = FileHelper.viewPdfExample(result.value, 'facture');
                } else {
                    this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                }
            });
    }

    /**
     * visualize pdf avoir example
     */
    visualizationPDFAvoir() {
        this.avoirService
            .ExampleGeneratePDF(this.buildDocumentParamsObject())
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.displayAvoirData = FileHelper.viewPdfExample(result.value, 'devis');
                } else {
                    this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                }
            });
    }

    /**
     * visualize pdf devis visualize
     */
    visualizationPDFDevis() {
        this.devisService
            .ExampleGeneratePDF(this.buildDocumentParamsObject())
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.displayDevisData = FileHelper.viewPdfExample(result.value, 'devis');
                } else {
                    this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                }
            });
    }

    /**
     * visualize pdf devis visualize
     */
    visualizationPDFBonCommande() {
        this.bonCommandeService
            .ExampleGeneratePDF(this.buildDocumentParamsObject())
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.displayBonCommandeData = FileHelper.viewPdfExample(result.value, 'BonCommande');
                } else {
                    this.toastService.error(this.translate.instant('ERRORS.SERVER'));
                }
            });
    }

    //#endregion

    //#region helpers

    /**
     * set validate delay
     */
    setValidateDelay() {
        const items = ConversionHelper.convertEnumToListKeysValues<string, string>(ValidateDocumentParameter, 'number');
        this.validateDelay = [];
        items.forEach(element => {
            this.validateDelay.push({
                value: element.value,
                text: `VALIDATE_DELAY.${element.text}`
            });
        });
    }

    /**
     * build document params object
     */
    buildDocumentParamsObject(): IDocumentParametersModel {
        const documentParameters: IDocumentParametersModel = {
            facture: this.formFacture.value,
            avoir: this.formAvoir.value,
            tva: this.tvaParameter,
            devis: this.formDevis.value,
            bonCommande: this.formBonCommande.value,
            agenceId: UserHelper.getAgenceId()
        };
        return documentParameters;
    }

    //#endregion

}
