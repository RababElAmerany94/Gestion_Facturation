import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AppSettings } from 'app/app-settings/app-settings';

export class ClientShared {

    static createForm(formBuilder: FormBuilder): FormGroup {
        return formBuilder.group({
            reference: [null, [Validators.required]],
            firstName: [null, [Validators.required]],
            lastName: [null],
            regulationModeId: [null],
            phoneNumber: [null, [Validators.required]],
            email: [null, [Validators.required, Validators.pattern(AppSettings.regexEmail)]],
            webSite: [null],
            siret: [null],
            codeComptable: [null, [Validators.required]],
            commercials: [null],
            sourceLeadId: [null],
            type: [null, [Validators.required]],
            genre: [null, [Validators.required]],
            primeCEEId: [null],
            labelPrimeCEE: [null],
            typeTravaux: [null],
            numeroAH: [null],
            revenueFiscaleReference: [null],
            precarite: [null],
            isMaisonDePlusDeDeuxAns: [null],
            nombrePersonne: [null],
            surfaceTraiter: [null],
            parcelleCadastrale: [null],
            logementTypeId: [null],
            origin: [null],
            typeChauffageId: [null],
            isSousTraitant: [false],
            dateReceptionLead: [null],
            agenceId: [null],
            noteDevis: [null],
        });
    }

}
