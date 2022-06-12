import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDropDownItem } from '../../../../core/models/general/drop-down-item.model';
import { PrestationType } from '../../../../core/enums/prestation-type.enum';
import { ConversionHelper } from '../../../../core/helpers/conversion';
import { StringHelper } from '../../../../core/helpers/string';
import { IPhotoDocument } from 'app/core/models/dossierPVModel';

@Component({
    selector: 'kt-information-fiche-controle',
    templateUrl: './information-fiche-controle.component.html',
    styleUrls: [],
})
export class InformationFicheControleComponent implements OnInit {

    /** anomalie pv */
    @Input()
    anomalies: IPhotoDocument[] = [];

    @Input()
    form: FormGroup;

    @Input()
    signatureController: string;

    @Input()
    signatureClient: string;

    @Input()
    nameClientSignature: string;

    @Input()
    nameControllerSignature: string;

    prestationType: IDropDownItem<number, string>[] = [];

    stringHelper: typeof StringHelper = StringHelper;

    constructor() { }

    ngOnInit() {
        this.chargeDropDownPrestationTypeStatusItem();
    }

    /** charge dropdown prestation type */
    chargeDropDownPrestationTypeStatusItem() {
        this.prestationType = ConversionHelper.convertEnumToListKeysValues(PrestationType, 'number');
        this.prestationType.forEach(e => e.text = `PRESTATION_TYPE.${e.value}`);
    }
}
