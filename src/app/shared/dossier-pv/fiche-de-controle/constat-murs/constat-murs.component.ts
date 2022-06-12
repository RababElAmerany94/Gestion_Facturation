import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDropDownItem } from '../../../../core/models/general/drop-down-item.model';
import { ConversionHelper } from '../../../../core/helpers/conversion';
import { FicheControleStatusItem } from '../../../../core/enums/fiche-controle-status-item.enum';

@Component({
    selector: 'kt-constat-murs',
    templateUrl: './constat-murs.component.html',
    styleUrls: ['./constat-murs.component.scss']
})
export class ConstatMursComponent implements OnInit {

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
