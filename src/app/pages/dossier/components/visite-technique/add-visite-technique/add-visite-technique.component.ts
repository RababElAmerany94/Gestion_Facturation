import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VisteTechniqueToit } from 'app/core/enums/viste-technique-toit.enum';
import { VisteTechniqueTypeAccess } from 'app/core/enums/viste-technique-type-access.enum';
import { VisteTechniqueType } from 'app/core/enums/viste-technique-type.enum';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IVisteTechniqueFormulaire } from 'app/pages/dossier/dossier.model';

@Component({
    selector: 'kt-add-visite-technique',
    templateUrl: './add-visite-technique.component.html'
})
export class AddVisiteTechniqueComponent implements OnInit {

    form: FormGroup;

    /** dropdowns */
    visteTechniqueTypeAccess: IDropDownItem<number, string>[] = [];
    visteTechniqueToit: IDropDownItem<number, string>[] = [];

    typeVisiteTechnique: VisteTechniqueType;
    typeVisiteTechniques = VisteTechniqueType;

    isToit = false;
    isTrappe = false;
    isShowMode = false;

    title: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: {
            typeVisiteTechnique: VisteTechniqueType,
            formulaire?: IVisteTechniqueFormulaire,
            isShowMode?: boolean,
            title: string,
        },
        private matDialogRef: MatDialogRef<AddVisiteTechniqueComponent>,
        private fb: FormBuilder,
    ) {
        this.initForm();
        this.chargeVisteTechniqueTypeAccess();
        this.chargeVisteTechniqueToit();
    }

    /**
     * initialize form
     */
    initForm() {
        this.form = this.fb.group({
            typeAccess: [null],
            dimensions: [null],
            toit: [null],
            detailTypeAccess: [null],
            surfaceComble: [null],
            surfacePiece: [null],
            typePlancher: [null],
            hauteurSousFaitage: [null],
            hauteurSousPlafond: [null],
            nombreConduitCheminee: [null],
            nombreSpotsAProteger: [null],
            nombreLuminaire: [null],
            nombreVMC: [null],
            presenceTuyauterie: [null],
            typeSupport: [null],
            presencePorteGarge: [null],
            isDegagementAPrevoir: [false],
            isACoffrer: [false],
            isARehausser: [false],
            isPresenceNuisibles: [false],
            typeNuisible: [null],
            isPresenceBoitesDerivation: [false],
        });
    }

    ngOnInit(): void {
        this.typeVisiteTechnique = this.data.typeVisiteTechnique;
        this.title = this.data.title;
        if (this.data?.formulaire) {
            this.setData(this.data.formulaire);
        }
        if (this.data?.isShowMode) {
            this.isShowMode = true
            this.form.disable();
        }
    }

    //#region helpers

    /** viste Technique Type Access Technique enum  */
    chargeVisteTechniqueTypeAccess() {
        this.visteTechniqueTypeAccess = ConversionHelper.convertEnumToListKeysValues(VisteTechniqueTypeAccess, 'number');
        this.visteTechniqueTypeAccess.forEach(e => e.text = `VISITE_TECHNIQUE_TYPE_ACCESS.${e.value}`);
    }

    /** viste Technique Toit enum  */
    chargeVisteTechniqueToit() {
        this.visteTechniqueToit = ConversionHelper.convertEnumToListKeysValues(VisteTechniqueToit, 'number');
        this.visteTechniqueToit.forEach(e => e.text = `VISITE_TECHNIQUE_TOIT.${e.value}`);
    }

    visteTechniqueTypeAccessEvent(item: VisteTechniqueTypeAccess) {
        if (item === VisteTechniqueTypeAccess.Trappe) {
            this.isTrappe = true;
            this.isToit = false;
        } else if (item === VisteTechniqueTypeAccess.Toit) {
            this.isTrappe = false;
            this.isToit = true;
        } else if (item === VisteTechniqueTypeAccess.Autre) {
            this.isTrappe = false;
            this.isToit = false;
        }
    }

    //#endregion

    //#region Save

    Save() {
        this.matDialogRef.close({ ...this.form.value });
    }

    /**
     * setData form
     */
    setData(visiteTechnique: IVisteTechniqueFormulaire) {
        this.form.setValue({
            typeAccess: visiteTechnique.typeAccess,
            dimensions: visiteTechnique.dimensions,
            toit: visiteTechnique.toit,
            detailTypeAccess: visiteTechnique.detailTypeAccess,
            surfaceComble: visiteTechnique.surfaceComble,
            surfacePiece: visiteTechnique.surfacePiece,
            typePlancher: visiteTechnique.typePlancher,
            hauteurSousFaitage: visiteTechnique.hauteurSousFaitage,
            hauteurSousPlafond: visiteTechnique.hauteurSousPlafond,
            nombreConduitCheminee: visiteTechnique.nombreConduitCheminee,
            nombreSpotsAProteger: visiteTechnique.nombreSpotsAProteger,
            nombreLuminaire: visiteTechnique.nombreLuminaire,
            nombreVMC: visiteTechnique.nombreVMC,
            presenceTuyauterie: visiteTechnique.presenceTuyauterie,
            typeSupport: visiteTechnique.typeSupport,
            presencePorteGarge: visiteTechnique.presencePorteGarge,
            isDegagementAPrevoir: visiteTechnique.isDegagementAPrevoir,
            isACoffrer: visiteTechnique.isACoffrer,
            isARehausser: visiteTechnique.isARehausser,
            isPresenceNuisibles: visiteTechnique.isPresenceNuisibles,
            typeNuisible: visiteTechnique.typeNuisible,
            isPresenceBoitesDerivation: visiteTechnique.isPresenceBoitesDerivation,
        });
    }

    //#endregion
}
