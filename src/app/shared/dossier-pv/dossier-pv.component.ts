import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { IDossierPV, IPhotoDocument } from 'app/core/models/dossierPVModel';
import { IArticle } from '../../core/models/general/article.model';
import { DialogHelper } from '../../core/helpers/dialog';
import { FicheDeControleComponent } from './fiche-de-controle/fiche-de-controle.component';
import { StringHelper } from '../../core/helpers/string';

@Component({
    selector: 'kt-dossier-pv',
    templateUrl: './dossier-pv.component.html',
})
export class DossierPvComponent implements OnInit {

    @Input()
    set DossierPV(value: IDossierPV[]) {
        this.dossierPV = value[0];
        this.initializeData(this.dossierPV);
    }
    form: FormGroup;
    articles: IArticle[] = [];
    dossierPV: IDossierPV;

    satisfied: boolean;

    /** signture client */
    signatureClient: string;

    /** signature techncien */
    signatureTechnicien: string;

    /** anomalie pv */
    anomalies: IPhotoDocument[] = [];

    stringHelper: typeof StringHelper = StringHelper;

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
    ) {
        this.initializeForm();
    }

    ngOnInit() {
    }

    /** initialize form */
    initializeForm() {
        this.form = this.fb.group({
            nameClientSignature: [null, [Validators.required]],
            reasonNoSatisfaction: [null],
            isSatisfied: [false],
        });
    }

    /** initialization component */
    initializeData(pv: IDossierPV) {
        if (pv != null) {
            this.setDataForm(pv);
            this.anomalies = pv.photos;
            this.signatureClient = pv.signatureClient;
            this.signatureTechnicien = pv.signatureTechnicien;
            this.articles = pv.articles;
        }
        this.form.disable();
    }

    /**
     * set data in form
     */
    setDataForm(pv: IDossierPV) {
        this.form.setValue({
            nameClientSignature: pv.nameClientSignature,
            reasonNoSatisfaction: pv.reasonNoSatisfaction,
            isSatisfied: pv.isSatisfied,
        });
        if (pv.isSatisfied === true) {
            this.satisfied = true;
        }
    }

    //#region helpers
    showFicheDeControle() {
        const data = { ficheDeControle: this.dossierPV.ficheControle };
        DialogHelper.openDialog(this.dialog, FicheDeControleComponent, DialogHelper.SIZE_LARGE, data);
    }
    //#endregion
}
