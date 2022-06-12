import { Component, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ClassementTechnique } from 'app/core/enums/classement-technique.enum';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { VisteTechniqueType } from 'app/core/enums/viste-technique-type.enum';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { DialogHelper } from 'app/core/helpers/dialog';
import { ObjectHelper } from 'app/core/helpers/object';
import { StringHelper } from 'app/core/helpers/string';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { IVisteTechnique, IVisteTechniqueFormulaire } from '../../dossier.model';
import { AddTypeVisiteTechniqueComponent } from '../add-type-visite-technique/add-type-visite-technique.component';
import { AddVisiteTechniqueComponent } from './add-visite-technique/add-visite-technique.component';

@Component({
    selector: 'kt-visite-technique',
    templateUrl: './visite-technique.component.html'
})
export class VisiteTechniqueComponent extends BaseEditTemplateComponent<IVisteTechnique> {

    /** dropdowns */
    classementTechnique: IDropDownItem<number, string>[] = [];

    /** form of visite technique */
    formulaires: IVisteTechniqueFormulaire[] = [];

    visiteTechnique: IVisteTechnique;
    typeVisiteTechnique: VisteTechniqueType;
    typeVisiteTechniques = VisteTechniqueType;

    /** set the visite Technique dossier */
    @Input()
    set VisiteTechnique(visiteTechnique: IVisteTechnique) {
        if (!ObjectHelper.isNullOrEmpty(visiteTechnique)) {
            this.visiteTechnique = visiteTechnique;
            this.formulaires = visiteTechnique.formulaires;
            this.typeVisiteTechnique = visiteTechnique.type
            this.showMode();
            this.setData(visiteTechnique);
        }
    }

    constructor(
        private dialog: MatDialog,
        private fb: FormBuilder,
        private translate: TranslateService,
        private toastService: ToastService,
    ) {
        super();
        this.initFormVisiteTechnique();
        this.chargeClassementTechnique();
        if (this.visiteTechnique == null) {
            this.addMode();
        } else {
            this.showMode();
        }
    }

    //#region forms

    /**
     * initialize form
     */
    initFormVisiteTechnique() {
        this.form = this.fb.group({
            nombrePiece: [0, [Validators.required]],
            surfaceTotaleAIsoler: [null, [Validators.required]],
            classementTechnique: [null, [Validators.required]],
        });
    }

    //#endregion

    //#region click event

    /**
     * add visite technique associate with dossier
     */
    addClick() {
        DialogHelper.openDialog(this.dialog, AddTypeVisiteTechniqueComponent, DialogHelper.SIZE_SMALL, null)
            .subscribe((resultTypeVisiteTechnique) => {
                if (!StringHelper.isEmptyOrNull(resultTypeVisiteTechnique)) {
                    this.typeVisiteTechnique = resultTypeVisiteTechnique;
                    this.addMode();
                }
            });
    }

    /**
     * click edit
     */
    editClick() {
        this.editMode();
    }

    /**
     * save a form to visite technique
     */
    save() {
        if (this.form.valid) {
            const visiteTechnique: IVisteTechnique = { ...this.form.value };
            visiteTechnique.formulaires = this.formulaires;
            visiteTechnique.type = this.typeVisiteTechnique;
            this.showMode();
            this.addEvent.emit(visiteTechnique);
        }
        else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * add a form to visite technique
     */
    addForm() {
        if (!this.isShowMode()) {
            const data = {
                typeVisiteTechnique: this.typeVisiteTechnique,
                title: 'FORMULAIRE.ADD_TITLE'
            };
            DialogHelper.openDialog(this.dialog, AddVisiteTechniqueComponent, DialogHelper.SIZE_LARGE, data)
                .subscribe((result) => {
                    if (!StringHelper.isEmptyOrNull(result)) {
                        this.formulaires.push(result);
                        this.updateNombrePiece();
                    }
                });
        }
    }

    /**
     * show form
     */
    openForm(index: number) {
        const data = {
            typeVisiteTechnique: this.typeVisiteTechnique,
            isShowMode: true,
            formulaire: this.formulaires[index],
            title: 'FORMULAIRE.SHOW_TITLE'
        };
        DialogHelper.openDialog(this.dialog, AddVisiteTechniqueComponent, DialogHelper.SIZE_LARGE, data);
    }

    /**
     * edit a form to visite technique
     */
    editForm(index: number) {
        const data = {
            typeVisiteTechnique: this.typeVisiteTechnique,
            formulaire: this.formulaires[index],
            title: 'FORMULAIRE.EDIT_TITLE'
        };
        DialogHelper.openDialog(this.dialog, AddVisiteTechniqueComponent, DialogHelper.SIZE_LARGE, data)
            .subscribe((result) => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.formulaires[index] = result;
                }
            });
    }

    /**
     * remove form to visite technique
     */
    removeForm(index: number) {
        DialogHelper.openConfirmDialog(this.dialog, {
            header: this.translate.instant('FORMULAIRE.DELETE.HEADER'),
            message: this.translate.instant('FORMULAIRE.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.formulaires.splice(index, 1);
            this.updateNombrePiece();
        });
    }

    //#endregion


    //#region helpers

    /** Classement Technique enum  */
    chargeClassementTechnique() {
        this.classementTechnique = ConversionHelper.convertEnumToListKeysValues(ClassementTechnique, 'number');
        this.classementTechnique.forEach(e => e.text = `CLASSEMENT_TECHNIQUE.${e.value}`);
    }

    /**
     * setData form
     */
    setData(visiteTechnique: IVisteTechnique) {
        this.form.setValue({
            nombrePiece: visiteTechnique.nombrePiece,
            surfaceTotaleAIsoler: visiteTechnique.surfaceTotaleAIsoler,
            classementTechnique: visiteTechnique.classementTechnique,
        });
    }

    private addMode() {
        this.mode = ModeEnum.Add;
        this.form.enable();
    }

    private showMode() {
        this.mode = ModeEnum.Show;
        this.form.disable();
    }

    private editMode() {
        this.mode = ModeEnum.Edit;
        this.form.enable();
    }

    private updateNombrePiece() {
        this.form.get('nombrePiece').setValue(this.formulaires.length);
    }

    //#endregion
}
