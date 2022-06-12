import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDropDownItem } from '../../../../core/models/general/drop-down-item.model';
import { ConversionHelper } from '../../../../core/helpers/conversion';
import { FicheControleStatusItem } from '../../../../core/enums/fiche-controle-status-item.enum';

@Component({
    selector: 'kt-constat-planchers',
    templateUrl: './constat-planchers.component.html',
    styleUrls: ['./constat-planchers.component.scss']
})
export class ConstatPlanchersComponent implements OnInit {

    @Input()
    form: FormGroup;

    ficheControleStatusItem: IDropDownItem<number, string>[] = [];

    constructor() { }

    ngOnInit() {
        this.chargeDropDownFicheControleStatusItem();
    }

    /** charge dropdown fiche Controle Status Item */
    chargeDropDownFicheControleStatusItem() {
        this.ficheControleStatusItem = ConversionHelper.convertEnumToListKeysValues(FicheControleStatusItem, 'number');
        this.ficheControleStatusItem.forEach(e => e.text = `FICHE_CONTROLE_STATUS_ITEM.${e.value}`);
    }

}
