import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPagedResult } from 'app/core/models/general/result-model';
import { ITypeLogement } from '../../type-logement.model';

@Component({
    selector: 'kt-index-type-logement',
    templateUrl: './index-type-logement.component.html'
})
export class IndexTypeLogementComponent extends BaseIndexTemplateComponent<ITypeLogement, string> implements OnInit {

    @Input()
    set data(data: IPagedResult<ITypeLogement>) {
        if (data != null) {
            this.typeLogements = { ...data as IPagedResult<any> };
            this.typeLogements.value = data.value
                .map<ITypeLogement>(e => this.mapITypeLogementIntoITypeLogementDataTable(e));
        }
    }

    typeLogements: IPagedResult<ITypeLogement>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.TypeLogement);
    }

    ngOnInit() {
        this.setColumns();
    }

    //#region mapping

    /**
     * set columns
     */
    setColumns() {
        this.columns = [
            {
                name: 'name',
                nameTranslate: 'LABELS.FIRSTNAME',
                isOrder: true,
                type: ColumnType.any
            },
        ];
    }

    /**
     * mapping typeLogement to typeLogement dataTables
     * @param typeLogement the typeLogement information
     */
    mapITypeLogementIntoITypeLogementDataTable(typeLogement: ITypeLogement): ITypeLogement {
        const typeLogementDataTables: ITypeLogement = {
            id: typeLogement.id,
            name: typeLogement.name
        };

        return typeLogementDataTables;
    }

    //#endregion

    //#region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('TYPE_LOGEMENT.DELETE.HEADER'),
            message: this.translate.instant('TYPE_LOGEMENT.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion

}
