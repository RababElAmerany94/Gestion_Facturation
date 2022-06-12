import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IAgendaConfig, IAgendaConfigDataTables } from './../../agenda-config.model';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { IPagedResult } from 'app/core/models/general/result-model';
import { AgendaType } from 'app/core/enums/agenda-type.enum';

@Component({
    selector: 'kt-index-agenda-config',
    templateUrl: './index-agenda-config.component.html'
})
export class IndexAgendaConfigComponent extends BaseIndexTemplateComponent<IAgendaConfigDataTables, string> implements OnInit {

    @Input()
    set data(data: IPagedResult<IAgendaConfig>) {
        if (data != null) {
            this.AgendaConfigs = { ...data as IPagedResult<any> };
            this.AgendaConfigs.value = data.value
                .map<IAgendaConfigDataTables>(e => this.mapIAgendaConfigIntoIAgendaConfigDataTable(e));
        }
    }

    /** set type agenda */
    @Input()
    set type(value: AgendaType) {
        if (value != null) {
            this.typeTabs = value;
            this.title = this.getTitles();
        }
    }

    /** the type of this tabs */
    AgendaConfigs: IPagedResult<IAgendaConfigDataTables>;

    /** the title of this tabs */
    title: string;

    /** the type of this tabs */
    typeTabs: AgendaType;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.AgendaParametrage);
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
     * mapping AgendaConfig to AgendaConfig dataTables
     * @param AgendaConfig the AgendaConfig information
     */
    mapIAgendaConfigIntoIAgendaConfigDataTable(AgendaConfig: IAgendaConfig): IAgendaConfigDataTables {
        const AgendaConfigDataTables: IAgendaConfigDataTables = {
            id: AgendaConfig.id,
            name: AgendaConfig.name
        };

        return AgendaConfigDataTables;
    }

    //#endregion

    //#region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        const name = this.getNameType(this.typeTabs);
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant(`${name}.DELETE.HEADER`),
            message: this.translate.instant(`${name}.DELETE.MESSAGE`),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    //#endregion

    //#region helpers

    /**
     * title of dialog
     */
    getTitles() {
        switch (this.typeTabs) {
            case AgendaType.TacheType:
                return 'TYPE_TACHE.LIST_TITLE';

            case AgendaType.RdvType:
                return 'TYPE_RDV.LIST_TITLE';

            case AgendaType.EvenementCategorie:
                return 'CATEGORIE_EVENEMENT.LIST_TITLE';

            case AgendaType.AppelType:
                return 'TYPE_APPEL.LIST_TITLE';

            case AgendaType.SourceRDV:
                return 'SOURCE_RDV.LIST_TITLE';
        }
    }

    /**
     * name of pop up
     */
    getNameType(type: AgendaType) {
        switch (type) {
            case AgendaType.TacheType:
                return 'TYPE_TACHE';

            case AgendaType.RdvType:
                return 'TYPE_RDV';

            case AgendaType.EvenementCategorie:
                return 'CATEGORIE_EVENEMENT';

            case AgendaType.AppelType:
                return 'TYPE_APPEL';

            case AgendaType.SourceRDV:
                return 'SOURCE_RDV';
        }
    }

    //#endregion
}
