import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { IFicheControle, IFicheControleModel } from '../../../core/models/ficheControleModel';
import { IConstatCombles } from '../../../core/enums/constat-combles.model';
import { IConstatMurs } from '../../../core/enums/constat-murs.model';
import { IConstatPlanchers } from '../../../core/enums/constat-planchers.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IPhotoDocument } from 'app/core/models/dossierPVModel';

@Component({
    selector: 'kt-fiche-de-controle',
    templateUrl: './fiche-de-controle.component.html'
})
export class FicheDeControleComponent implements OnInit {

    /** Form of fiche intervention */
    form: FormGroup;
    formConstatComble: FormGroup;
    formConstatMurs: FormGroup;
    formConstatPlanchers: FormGroup;

    /** signture client */
    signatureClient: string;

    /** signature techncien */
    signatureController: string;

    photos: IPhotoDocument[] = [];

    ficheDeControle: IFicheControleModel;
    constatComble: IConstatCombles;
    constatMurs: IConstatMurs;
    constatPlanchers: IConstatPlanchers;

    nameSignatureController: string;
    nameClientSignature: string;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<FicheDeControleComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            ficheDeControle: IFicheControle
        },
    ) {
        this.initializeForm();
        this.initFormConstatComble();
        this.initFormConstatMurs();
        this.initFormConstatPlanchers();
        this.setForm(data.ficheDeControle);
    }

    ngOnInit() {
    }

    /** initialize form */
    initializeForm() {
        this.form = this.fb.group({
            numberOperation: [null, [Validators.required]],
            prestationType: [null, [Validators.required]],
            dateControle: [null, [Validators.required]],
            remarques: [null],
            evaluationAccompagnement: [3],
            evaluationTravauxRealises: [3],
            evaluationPropreteChantier: [3],
            evaluationContactAvecTechniciensApplicateurs: [3],
            controllerId: [null, [Validators.required]],
            nameClientSignature: [null, [Validators.required]],
        });
    }

    initFormConstatComble() {
        this.formConstatComble = this.fb.group({
            surfaceIsolantPrevue: [null],
            posteType: [null, [Validators.required]],
            trappeVisiteIsolee: [null],
            surfaceIsolantPose: [null],
            presencePigeReperageHauteurIsolant: [null],
            presenceProtectionPointsLumineuxTypeSpots: [null],
            conclusionEpaisseur: [null],
            homogeneiteCoucheIsolant: [null],
            presenceEcartAuFeuOuConduitsEvacuationFumees: [null],
            reperageBoitesElectriques: [null],
            rehausseOuProtectionInstallationsElectriques: [null],
            surfaceIsolantRetenue: [null],
            surfaceEstimeDepuis: [null],
            presenceCoffrageTrappeVisite: [null],
            epaisseurMesuree: [null],
            isEcartSurfacePrevueAndPoseOk: [false],
        });
    }

    initFormConstatMurs() {
        this.formConstatMurs = this.fb.group({
            surfaceIsolantPrevue: [null, [Validators.required]],
            surfaceIsolantPose: [null],
            isPoseCorrecteIsolant: [false],
            ecartAutourPointsEclairage: [null],
            ecartAutourBoitiersElectrique: [null],
            ecartAuFeuAutourFumees: [null],
            presenceFilsNonGainesNoyesDansIsolant: [null],
            conclusionIsolationMurs: [false],
        });
    }

    initFormConstatPlanchers() {
        this.formConstatPlanchers = this.fb.group({
            surfaceIsolantPrevue: [null],
            surfaceIsolantPose: [null],
            isPoseCorrecteIsolant: [false],
            ecartAutourPointsEclairage: [null],
            ecartAutourBoitiersElectrique: [null],
            ecartAuFeuAutourFumees: [null],
            presenceFilsNonGainesNoyesDansIsolant: [null],
            conclusionIsolationPlanchers: [false]
        });
    }

    /**
     * set constat comble
     */
    setForm(ficheDC: IFicheControle) {
        if (ficheDC != null) {
            this.form.patchValue({
                numberOperation: ficheDC.numberOperation,
                prestationType: ficheDC.prestationType,
                dateControle: ficheDC.dateControle,
                remarques: ficheDC.remarques,
                evaluationAccompagnement: ficheDC.evaluationAccompagnement,
                evaluationTravauxRealises: ficheDC.evaluationTravauxRealises,
                evaluationPropreteChantier: ficheDC.evaluationPropreteChantier,
                evaluationContactAvecTechniciensApplicateurs: ficheDC.evaluationContactAvecTechniciensApplicateurs,
                controllerId: ficheDC.controllerId,
            });
            this.constatComble = ficheDC.constatCombles;
            this.constatMurs = ficheDC.constatMurs;
            this.constatPlanchers = ficheDC.constatPlanchers;
            this.photos = ficheDC.photos;
            this.signatureClient = ficheDC.signatureClient;
            this.signatureController = ficheDC.signatureController;
            this.nameClientSignature = ficheDC.nameClientSignature;
            this.nameSignatureController = ficheDC.controller.fullName;
            this.setConstatComble(this.constatComble);
            this.setConstatMurs(this.constatMurs);
            this.setConstatPlanchers(this.constatPlanchers);
        }
        this.form.disable();
        this.formConstatComble.disable();
        this.formConstatMurs.disable();
        this.formConstatPlanchers.disable();
    }

    /**
     * set constat comble
     */
    setConstatComble(constat: IConstatCombles) {
        this.formConstatComble.patchValue({
            surfaceIsolantPrevue: constat.surfaceIsolantPrevue,
            posteType: constat.posteType,
            trappeVisiteIsolee: constat.trappeVisiteIsolee,
            surfaceIsolantPose: constat.surfaceIsolantPose,
            presencePigeReperageHauteurIsolant: constat.presencePigeReperageHauteurIsolant,
            presenceProtectionPointsLumineuxTypeSpots: constat.presenceProtectionPointsLumineuxTypeSpots,
            conclusionEpaisseur: constat.conclusionEpaisseur,
            homogeneiteCoucheIsolant: constat.homogeneiteCoucheIsolant,
            presenceEcartAuFeuOuConduitsEvacuationFumees: constat.presenceEcartAuFeuOuConduitsEvacuationFumees,
            reperageBoitesElectriques: constat.reperageBoitesElectriques,
            rehausseOuProtectionInstallationsElectriques: constat.rehausseOuProtectionInstallationsElectriques,
            surfaceIsolantRetenue: constat.surfaceIsolantRetenue,
            surfaceEstimeDepuis: constat.surfaceEstimeDepuis,
            presenceCoffrageTrappeVisite: constat.presenceCoffrageTrappeVisite,
            epaisseurMesuree: constat.epaisseurMesuree,
            isEcartSurfacePrevueAndPoseOk: constat.isEcartSurfacePrevueAndPoseOk,
        });
    }

    /**
     * set constat murs
     */
    setConstatMurs(constat: IConstatMurs) {
        this.formConstatMurs.patchValue({
            surfaceIsolantPrevue: constat.surfaceIsolantPrevue,
            surfaceIsolantPose: constat.surfaceIsolantPose,
            isPoseCorrecteIsolant: constat.isPoseCorrecteIsolant,
            ecartAutourPointsEclairage: constat.ecartAutourPointsEclairage,
            ecartAutourBoitiersElectrique: constat.ecartAutourBoitiersElectrique,
            ecartAuFeuAutourFumees: constat.ecartAuFeuAutourFumees,
            presenceFilsNonGainesNoyesDansIsolant: constat.presenceFilsNonGainesNoyesDansIsolant,
            conclusionIsolationMurs: constat.conclusionIsolationMurs,
        });
    }

    /**
     * set constat planchers
     */
    setConstatPlanchers(constat: IConstatPlanchers) {
        this.formConstatPlanchers.patchValue({
            surfaceIsolantPrevue: constat.surfaceIsolantPrevue,
            surfaceIsolantPose: constat.surfaceIsolantPose,
            isPoseCorrecteIsolant: constat.isPoseCorrecteIsolant,
            ecartAutourPointsEclairage: constat.ecartAutourPointsEclairage,
            ecartAutourBoitiersElectrique: constat.ecartAutourBoitiersElectrique,
            ecartAuFeuAutourFumees: constat.ecartAuFeuAutourFumees,
            presenceFilsNonGainesNoyesDansIsolant: constat.presenceFilsNonGainesNoyesDansIsolant,
            conclusionIsolationPlanchers: constat.conclusionIsolationPlanchers,
        });
    }
}
