import { Component, OnInit, Input } from '@angular/core';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IRegulationMode } from 'app/core/models/regulation-mode/regulation-mode.model';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { ColumnDataTable, ColumnType } from 'app/shared/data-table/data-table.component';
import { RouteName } from 'app/core/enums/route-name.enum';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogHelper } from 'app/core/helpers/dialog';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';

@Component({
    selector: 'kt-index-regulation',
    templateUrl: './index-regulation.component.html'
})
export class IndexRegulationComponent extends
    BaseIndexTemplateComponent<IRegulationMode, string> implements OnInit {

    @Input() set data(data: IPagedResult<IRegulationMode>) {
        if (data != null) {
            this.modesReglement = { ...data as IPagedResult<IRegulationMode> };
        }
    }

    modesReglement: IPagedResult<IRegulationMode>;
    columns: ColumnDataTable[] = [];
    routeName = RouteName;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog,
    ) {
        super();
        this.setModule(this.modules.Parameters);
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
            }
        ];
    }
    /**
     * add click button
     */

    addClick() {
        this.addEvent.emit();
    }

    /**
     * edit button click
     */
    editClick(regulationMode: IRegulationMode) {
        this.editEvent.emit(regulationMode);
    }
    /**
     * delete button click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('MODE_REGLEMENT.DELETE.HEADER'),
            message: this.translate.instant('MODE_REGLEMENT.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }
    /**
     * change data table
     */
    changeEvent(dataTableOutput: IFilterOption) {
        this.filters.emit(dataTableOutput);
    }
}
