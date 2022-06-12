import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPagedResult } from 'app/core/models/general/result-model';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { ITypeChauffage } from '../../type-chauffage.model';

@Component({
    selector: 'kt-type-chauffage-index',
    templateUrl: './type-chauffage-index.component.html'
})
export class TypeChauffageIndexComponent extends BaseIndexTemplateComponent<ITypeChauffage, string> implements OnInit {

    @Input() set data(data: IPagedResult<ITypeChauffage>) {
        if (data != null) {
            this.typeChauffages = { ...data as IPagedResult<any> };
            this.typeChauffages.value = data.value
                .map<ITypeChauffage>(e => this.mapITypeChauffageIntoITypeChauffageDataTable(e));
        }
    }

    typeChauffages: IPagedResult<ITypeChauffage>;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.TypeChauffage);
    }

    ngOnInit() {
        this.setColumns();
    }

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
     * mapping typeChauffage to typeChauffage dataTables
     * @param typeChauffage the typeChauffage information
     */
    mapITypeChauffageIntoITypeChauffageDataTable(typeChauffage: ITypeChauffage): ITypeChauffage {
        const typeChauffageDataTable: ITypeChauffage = {
            id: typeChauffage.id,
            name: typeChauffage.name,
        };

        return typeChauffageDataTable;
    }

    // #region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('TYPE_CHAUFFAGE.DELETE.HEADER'),
            message: this.translate.instant('TYPE_CHAUFFAGE.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion

}
