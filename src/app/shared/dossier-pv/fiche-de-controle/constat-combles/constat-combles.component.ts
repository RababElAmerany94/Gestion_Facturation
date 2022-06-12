import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDropDownItem } from '../../../../core/models/general/drop-down-item.model';
import { ConversionHelper } from '../../../../core/helpers/conversion';
import { FicheControleStatusItem } from '../../../../core/enums/fiche-controle-status-item.enum';
import { PosteType } from '../../../../core/enums/poste-type.enum';

@Component({
    selector: 'kt-constat-combles',
    templateUrl: './constat-combles.component.html'
})
export class ConstatComblesComponent implements OnInit {

    @Input()
    form: FormGroup;

    ficheControleStatusItem: IDropDownItem<number, string>[] = [];
    posteType: IDropDownItem<number, string>[] = [];

    constructor() { }

    ngOnInit() {
        this.chargeDropDownFicheControleStatusItem();
        this.chargeDropDownPosteType();
    }

    /** charge dropdown fiche Controle Status Item */
    chargeDropDownFicheControleStatusItem() {
        this.ficheControleStatusItem = ConversionHelper.convertEnumToListKeysValues(FicheControleStatusItem, 'number');
        this.ficheControleStatusItem.forEach(e => e.text = `FICHE_CONTROLE_STATUS_ITEM.${e.value}`);
    }

    /** charge dropdown poste Type */
    chargeDropDownPosteType() {
        this.posteType = ConversionHelper.convertEnumToListKeysValues(PosteType, 'number');
        this.posteType.forEach(e => e.text = `POSTE_TYPE.${e.value}`);
    }

}
