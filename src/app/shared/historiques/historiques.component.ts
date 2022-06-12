import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ChangesHistoryType } from 'app/core/enums/change-history-type.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { TranslationService } from 'app/core/layout';
import { IHistorique } from 'app/core/models/general/historique';
import { DetailsHistoriqueComponent } from './details-historique/details-historique.component';
import { JsonHelper } from 'app/core/helpers/json';

@Component({
    selector: 'kt-historiques',
    templateUrl: './historiques.component.html',
    styleUrls: ['./historiques.component.scss']
})
export class HistoriquesComponent implements OnInit {

    @Input()
    set Historique(val: IHistorique[]) {
        if (val != null) {
            this.historiques = val;
        }
    }

    historiques: IHistorique[] = [];
    changesHistoryType: typeof ChangesHistoryType = ChangesHistoryType;
    labelsTranslated: any;

    constructor(
        private translationService: TranslationService,
        public dialog: MatDialog,
        private translate: TranslateService
    ) { }

    ngOnInit() {
        this.initTranslate();
    }

    /**
     * Get Translate Name
     */
    getTranslateByName(name: string): string {
        for (const i in this.labelsTranslated) {
            if (i.toLowerCase() === name.toLowerCase()) {
                return this.labelsTranslated[i];
            }
        }
        return name;
    }

    /**
     * Init translate
     */
    async initTranslate() {
        this.labelsTranslated = this.translationService.setTranslatedMessages(this.translate, 'LABELS');
    }

    getLengthMaxOfObject(before: string, after: string): number {
        const champBeforeLength = JSON.parse(before).length;
        const champAfterLength = JSON.parse(after).length;
        return champBeforeLength >= champAfterLength ? champBeforeLength : champAfterLength;
    }

    buildPhrase(object: object, key: string): string {
        if (this.checkIsObject(object[key])) { return ''; }

        const stringifyAfter = `<strong>${this.getTranslateByName(key)}</strong> :` +
            ` ${object[key] == null ? '' : this.getTranslateByName(object[key].toString())} </br>`;

        return stringifyAfter;
    }

    /**
     * check value is object
     * @param value value to check
     */
    checkIsObject(value: any) {
        return (typeof (value) === 'object');
    }

    /**
     * de serialize historique fields
     * @param historique the historique object
     */
    deSerializeHistoriqueFields(historique: IHistorique) {

        if (historique != null) {

            const detailHistorique = [];
            historique.fields.forEach((champ) => {

                if (JsonHelper.IsJsonString(champ.before) && JsonHelper.IsJsonString(champ.after)) {

                    const maxLength: number = this.getLengthMaxOfObject(champ.before, champ.after);

                    for (let index = 0; index < maxLength; index++) {

                        const afterObject = JSON.parse(champ.after);
                        let stringifyAfter = '';
                        for (const key in afterObject[index]) {
                            if (afterObject[index].hasOwnProperty(key)) {
                                stringifyAfter = stringifyAfter + this.buildPhrase(afterObject[index], key);
                            }
                        }

                        const beforeObject = JSON.parse(champ.before);
                        let stringifyBefore = '';

                        // tslint:disable-next-line: forin
                        for (const key in beforeObject[index]) {
                            stringifyBefore = stringifyBefore + this.buildPhrase(beforeObject[index], key);
                        }

                        if (beforeObject[index] !== afterObject[index]) {
                            detailHistorique.push(
                                {
                                    Attribute: this.getTranslateByName(champ.fieldName) + ' ' + (index + 1) + ' ',
                                    After: stringifyAfter,
                                    Before: stringifyBefore
                                }
                            );
                        }

                    }
                } else {
                    detailHistorique.push({
                        Attribute: this.getTranslateByName(champ.fieldName),
                        After: champ.after, Before: champ.before
                    });
                }

            });
            return detailHistorique;
        }
    }

    /**
     * show detail item history
     */
    showHistorique(historique: IHistorique) {
        this.dialog.open(DetailsHistoriqueComponent, {
            width: DialogHelper.SIZE_MEDIUM,
            data: {
                detailsHistory: this.deSerializeHistoriqueFields(historique)
            }
        });
    }

}
