import { Component, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DateHelper } from 'app/core/helpers/date';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { IDossierInstallation, IDossierInstallationModel } from './dossier-installation.model';

@Component({
    selector: 'kt-dossier-installaton',
    templateUrl: './dossier-installation.component.html',
})
export class DossierInstallationComponent extends BaseEditTemplateComponent<IDossierInstallationModel> {

    form: FormGroup;

    @Input()
    set DossierInstallation(dossier: IDossierInstallation[]) {
        this.initFormDateInstalation();
        if (dossier) {
            this.setDataInForm(dossier[0]);
        }
        this.form.disable();
    }

    constructor(
        private fb: FormBuilder,
    ) {
        super();
    }

    /**
     * initialize form date debut du travaux
     */
    initFormDateInstalation() {
        this.form = this.fb.group({
            technicienId: [null],
            dateDebutTravaux: [null],
            status: [null]
        });
    }

    /**
     * setData form
     */
    setDataInForm(dossier: IDossierInstallation) {
        this.form.setValue({
            status: '',
            technicienId: dossier?.technicien ? dossier?.technicien?.fullName : '',
            dateDebutTravaux: dossier?.dateDebutTravaux ? DateHelper.getDates(dossier?.dateDebutTravaux) : '',
        });
    }
}
