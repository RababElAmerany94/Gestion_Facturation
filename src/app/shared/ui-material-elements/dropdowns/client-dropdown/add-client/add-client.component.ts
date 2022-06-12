import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ClientType } from 'app/core/enums/client-type.enum';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { ClientShared } from 'app/pages/clients/client-shared';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { GenreClient } from '../../../../../core/enums/genre-client.enum';
import { StringHelper } from 'app/core/helpers/string';
import { ClType } from 'app/core/enums/cl-type.enum';

@Component({
    selector: 'kt-add-client',
    templateUrl: './add-client.component.html'
})
export class AddClientComponent implements OnInit {

    form: FormGroup;
    clientType: IDropDownItem<number, string>[] = [];
    genreClient: IDropDownItem<number, string>[] = [];
    title = 'TITLES.ADD_CLIENT';

    constructor(
        public dialogRef: MatDialogRef<AddClientComponent>,
        private fb: FormBuilder,
        private toastService: ToastService,
        private translate: TranslateService,
        private numerationService: NumerationService,
    ) {
        this.form = ClientShared.createForm(this.fb);
    }

    ngOnInit() {
        this.chargeDropDownClientType();
        this.chargeDropDownGenreClient();
    }

    /**
     * generate les champs a un client
     */
    generateChampsClient() {
        let type: NumerationType;

        if (this.isClientProfessionnel()) {
            type = NumerationType.CLIENT_PROFESSIONNEL;
        } else if (this.isClientParticulier()) {
            type = NumerationType.CLIENT_PARTICULIER;
        }

        if (type != null) {
            this.numerationService
                .GenerateNumerotation(type)
                .subscribe(item => {
                    if (item.status === ResultStatus.Succeed) {
                        this.form.get('reference').setValue(item.value);
                    }
                });
        } else {
            this.form.get('reference').setValue('');
        }
    }

    /** check is client particulier */
    isClientParticulier() {
        return this.form.get('type').value === ClientType.Particulier;
    }

    /** check is client professionnel */
    isClientProfessionnel() {
        return this.form.get('type').value === ClientType.Professionnel;
    }

    /** charge dropdown types */
    chargeDropDownClientType() {
        this.clientType = ConversionHelper.convertEnumToListKeysValues(ClType, 'number');
        this.clientType.forEach(e => e.text = `CL_TYPE.${e.value}`);
    }

    /** charge genre client */
    chargeDropDownGenreClient() {
        this.genreClient = ConversionHelper.convertEnumToListKeysValues(GenreClient, 'number');
        this.genreClient.forEach(e => e.text = `GENRE_CLIENT.${e.value}`);
    }

    /**
     * generate coode comptable
     */
    generateCodeComptable() {
        this.form.get('codeComptable').setValue(
            (StringHelper.isEmptyOrNull(this.form.controls.firstName.value) ? '' : this.form.controls.firstName.value.replace(/ /g, ''))
        );
    }

    /** save Client */
    save() {
        if (this.form.valid) {
            const values = this.form.getRawValue();
            values.commercials = this.buildClientCommercial();
            this.dialogRef.close(values);
        } else {
            this.form.markAllAsTouched();
            this.toastService.error(this.translate.instant('ERRORS.FILL_ALL'));
        }
    }

    /**
     * build client commercial
     */
    buildClientCommercial() {
        const clientCommercials = [];
        const commercialIds = this.form.get('commercials').value as string[];
        if (commercialIds != null) {
            commercialIds.forEach(commercialId => {
                clientCommercials.push({ commercialId });
            });
        }
        return clientCommercials;
    }

}
