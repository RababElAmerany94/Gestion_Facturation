import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSettings } from 'app/app-settings/app-settings';
import { ClientType } from 'app/core/enums/client-type.enum';
import { SortDirection } from 'app/core/enums/sort-direction';
import { IClientFilterOption } from 'app/core/models/general/filter-option.model';
import { IClient } from 'app/pages/clients/client.model';
import { ClientsService } from 'app/pages/clients/clients.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
    selector: 'kt-dialog-select-client',
    templateUrl: './dialog-select-client.component.html'
})
export class DialogSelectClientComponent implements OnInit {

    subs = new SubSink();

    title = 'TITLES.CHOOSE_CLIENT';

    clientId: string;
    searchControl = new FormControl();
    clients: IClient[] = [];
    pageCount = 1;
    filterOption: IClientFilterOption = {
        OrderBy: 'lastName',
        SortDirection: SortDirection.Asc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    constructor(
        private clientService: ClientsService,
        @Inject(MAT_DIALOG_DATA) public data: {
            types: ClientType[]
        },
        private dialogRef: MatDialogRef<DialogSelectClientComponent>,
    ) { }

    ngOnInit() {
        this.initializeData();
        this.subscribeSearchControl();
        this.getClients(this.filterOption);
    }

    initializeData() {
        if (this.data != null) {
            this.filterOption = {
                ...this.filterOption,
                types: this.data?.types
            };
        }
    }

    loadMore() {
        if (this.pageCount > this.filterOption.Page) {
            this.filterOption.Page++;
            this.getClients(this.filterOption);
        }
    }

    getClients(filterOption: IClientFilterOption) {
        this.clientService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                this.clients = [...this.clients, ...result.value];
                this.pageCount = result.pageCount;
            });
    }

    subscribeSearchControl() {
        this.subs.sink = this.searchControl.valueChanges
            .pipe(debounceTime(700), distinctUntilChanged())
            .subscribe(result => {
                this.pageCount = 0;
                this.clients = [];
                this.filterOption = {
                    ...this.filterOption,
                    Page: 1,
                    SearchQuery: result
                };
            });
    }

    save() {
        if (this.clientId != null) {
            this.dialogRef.close(this.clients.find(e => e.id === this.clientId));
        } else {
            this.dialogRef.close(null);
        }
    }
}
