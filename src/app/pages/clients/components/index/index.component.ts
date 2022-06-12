import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { IClient, IClientDataTables } from '../../client.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { ClientType } from 'app/core/enums/client-type.enum';
import { IClientFilterOption, IFilterOption } from 'app/core/models/general/filter-option.model';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';

@Component({
    selector: 'kt-client-index',
    templateUrl: './index.component.html'
})
export class IndexComponent extends BaseIndexTemplateComponent<IClientDataTables, string> implements OnInit {

    /** set data client */
    @Input()
    set data(data: IPagedResult<IClient>) {
        if (data != null) {
            this.clients = { ...data as IPagedResult<any> };
            this.clients.value = data.value.map<IClientDataTables>(e => this.mapIClientIntoIClientDataTables(e));
        }
    }

    @Input()
    set tabType(value: ClientType) {
        if (value != null) {
            this.type = value;
            this.initializeFilter();
        }
    }

    /** list clients */
    clients: IPagedResult<IClientDataTables>;

    /** filter options */
    filterOptions: IClientFilterOption = {
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        OrderBy: 'id',
        SortDirection: SortDirection.Desc,
        SearchQuery: '',
    };

    /** the selected tabs */
    type: ClientType;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.Clients);
    }

    ngOnInit() {
        this.initializeColumns();
    }

    //#region form filter

    /** initialize filter component */
    initializeFilter() {
        switch (this.type) {

            case ClientType.Professionnel:
                this.filterOptions.type = ClientType.Professionnel;
                break;

            case ClientType.Particulier:
                this.filterOptions.type = ClientType.Particulier;
                break;
            case ClientType.Obliges:
                this.filterOptions.type = ClientType.Obliges;
                break;
        }
    }

    //#endregion

    /**
     * initialize columns
     */
    initializeColumns() {
        this.columns = [
            {
                name: 'reference',
                nameTranslate: 'LABELS.REFERENCE',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'firstName',
                nameTranslate: 'LABELS.FIRSTNAME',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'lastName',
                nameTranslate: 'LABELS.LASTNAME',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'agenceId',
                nameTranslate: 'LABELS.AGENCE',
                isOrder: true,
                type: ColumnType.any
            }
        ];
    }

    /**
     * map client to client dataTables model
     */
    mapIClientIntoIClientDataTables(client: IClient): IClientDataTables {
        const clientDataTables: IClientDataTables = {
            id: client.id,
            reference: client.reference,
            firstName: client.firstName,
            lastName: client.lastName,
            agenceId: client?.agence?.raisonSociale ?? '-',
        };
        return clientDataTables;
    }

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('DELETE.HEADER_TEXT'),
            message: this.translate.instant('DELETE.QUESTION'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });
    }

    /**
     * change dataTables
     */
    changeFiltersEvent(dataTableOutput: IFilterOption) {
        this.filterOptions = { ...this.filterOptions, ...dataTableOutput };
        this.filters.emit(this.filterOptions);
    }
}
