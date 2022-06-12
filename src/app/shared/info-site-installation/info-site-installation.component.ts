import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PrecariteType } from 'app/core/enums/precarite.enums';
import { TypeTravaux } from 'app/core/enums/type-travaux.enum';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { ChampSiteInstallationService } from 'app/pages/parametres/champ-site-installation/champ-site-installation.service';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { IClientModel } from '../../pages/clients/client.model';

@Component({
    selector: 'kt-info-site-installation',
    templateUrl: './info-site-installation.component.html',
})
export class InfoSiteInstallationComponent extends BaseEditTemplateComponent<IClientModel> implements OnInit {

    @Output()
    informationsSupplementaireEvent = new EventEmitter<{ [key: string]: string; }>();

    @Input()
    informationsSupplementaire: { [key: string]: string; };

    @Input()
    readOnly = false;

    @Input()
    showInformationsSupplementaire = false;

    precarite: IDropDownItem<number, string>[] = [];
    typeTravaux: IDropDownItem<number, string>[] = [];
    champsForm = this.fb.group({});
    champs = [];

    constructor(
        private service: ChampSiteInstallationService,
        private fb: FormBuilder
    ) {
        super();
    }

    ngOnInit() {
        this.chargeDropDownClientTypeTravaux();
        this.chargeDropDownClientPrecarite();
        this.getChampsSiteInstallation();
    }

    getChampsSiteInstallation() {
        this.service.GetAll().subscribe(result => {
            this.champs = result.value.map(e => e.name.trim());
            this.champs.forEach(item => {
                this.champsForm.addControl(item.trim(), this.fb.control({ value: this.getOldValue(item), disabled: this.readOnly }, []));
            });
            this.subscribeChanges();
        })
    }

    //#region helpers

    /**
     * charge dropdown precarite
     */
    chargeDropDownClientPrecarite() {
        this.precarite = ConversionHelper.convertEnumToListKeysValues(PrecariteType, 'number');
        this.precarite.forEach(e => e.text = `PRECARITE_TYPE.${e.value}`);
    }

    /**
     * charge dropdown type travaux
     */
    chargeDropDownClientTypeTravaux() {
        this.typeTravaux = ConversionHelper.convertEnumToListKeysValues(TypeTravaux, 'number');
        this.typeTravaux.forEach(e => e.text = `TYPE_TRAVAUX.${e.value}`);
    }

    /**
     * subscribe changes
     */
    subscribeChanges() {
        this.champsForm
            .valueChanges
            .pipe(
                debounceTime(500),
                distinctUntilChanged()
            )
            .subscribe(values => {
                this.informationsSupplementaireEvent.emit(values);
            });
    }

    /**
     * get old value of champ
     */
    getOldValue(key: string) {
        if (this.informationsSupplementaire == null)
            return '';

        const index = Object.keys(this.informationsSupplementaire).findIndex(e => e.toLowerCase().trim() === key.toLowerCase().trim());
        return Object.values(this.informationsSupplementaire)[index];
    }

    //#endregion

}
