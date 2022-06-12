import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ConversionHelper } from 'app/core/helpers/conversion';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { INumeration, INumerationModel } from '../../numerotation.model';
import { EditNumerotationComponent } from '../edit-numerotation/edit-numerotation.component';
import { SharedNumerotation } from '../../shared/numerotation-shared';
import { UserHelper } from 'app/core/helpers/user';

@Component({
    selector: 'kt-numerotation-index',
    templateUrl: './index.component.html'
})
export class IndexNumerotationComponent implements OnInit {

    @Output() addEvent = new EventEmitter<INumerationModel>();
    @Output() editEvent = new EventEmitter<{ numerotation: INumerationModel, id: string }>();

    @Input() numerations: INumeration[] = [];

    /**
     * list des type numerotation
     */
    numerotationTypes: IDropDownItem<number, string>[] = [];

    constructor(
        private dialogMat: MatDialog
    ) { }

    ngOnInit() {
        this.initListNumerationType();
    }

    /**
     * init list numerotation type
     */
    private initListNumerationType() {
        let numerotationTypes = ConversionHelper.convertEnumToListKeysValues<number, string>(NumerationType, 'number');

        if (UserHelper.isFollowAgence()) {
            const excludeNumerotationConcesionnaire = [NumerationType.AGENCE];
            numerotationTypes = numerotationTypes.filter(e => !excludeNumerotationConcesionnaire.includes(e.value));
        }

        this.numerotationTypes = numerotationTypes;
    }

    /**
     * edit numerotation
     */
    editNumeration(type: NumerationType) {
        const numeration = this.numerations.find(e => e.type === type);
        DialogHelper.openDialog(this.dialogMat, EditNumerotationComponent, DialogHelper.SIZE_SMALL, { numeration, type })
            .subscribe(result => {
                if (result) {
                    if (numeration != null) {
                        this.editEvent.emit({ id: numeration.id, numerotation: result });
                    } else {
                        this.addEvent.emit(result);
                    }
                }
            });
    }

    /**
     * preview reference
     */
    previewReference(type: NumerationType) {
        const element = this.numerations.find(x => x.type === type);
        return element == null ? '' : SharedNumerotation.generateExampleCode(element);
    }
}
