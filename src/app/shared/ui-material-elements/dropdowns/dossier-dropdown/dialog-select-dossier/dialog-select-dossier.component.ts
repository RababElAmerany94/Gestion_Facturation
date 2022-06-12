import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSettings } from 'app/app-settings/app-settings';
import { SortDirection } from 'app/core/enums/sort-direction';
import { IDossierFilterOption } from 'app/core/models/general/filter-option.model';
import { IDossier } from 'app/pages/dossier/dossier.model';
import { DossierService } from 'app/pages/dossier/dossier.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SubSink } from 'subsink';

@Component({
    selector: 'kt-dialog-select-dossier',
    templateUrl: './dialog-select-dossier.component.html'
})
export class DialogSelectDossierComponent implements OnInit {

    subs = new SubSink();

    title = 'TITLES.CHOOSE_DOSSIER';

    dossierId: string;
    searchControl = new FormControl();
    dossiers: IDossier[] = [];
    pageCount = 1;
    filterOption: IDossierFilterOption = {
        OrderBy: 'lastName',
        SortDirection: SortDirection.Asc,
        Page: 1,
        PageSize: AppSettings.DEFAULT_PAGE_SIZE,
        SearchQuery: ''
    };

    constructor(
        private dossierService: DossierService,
        private dialogRef: MatDialogRef<DialogSelectDossierComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: {
            clientId?: string,
        }
    ) { }

    ngOnInit() {
        if (this.data?.clientId)
            this.filterOption.clientId = this.data?.clientId;
        this.subscribeSearchControl();
        this.getDossiers();
    }

    loadMore() {
        if (this.pageCount > this.filterOption.Page) {
            this.filterOption.Page++;
            this.getDossiers();
        }
    }

    getDossiers() {
        this.dossierService.GetAsPagedResult(this.filterOption)
            .subscribe(result => {
                this.dossiers = [...this.dossiers, ...result.value];
                this.pageCount = result.pageCount;
            });
    }

    subscribeSearchControl() {
        this.subs.sink = this.searchControl.valueChanges
            .pipe(debounceTime(700), distinctUntilChanged())
            .subscribe(result => {
                this.pageCount = 0;
                this.dossiers = [];
                this.filterOption = {
                    ...this.filterOption,
                    Page: 1,
                    SearchQuery: result
                };
            });
    }

    save() {
        if (this.dossierId != null) {
            this.dialogRef.close(this.dossiers.find(e => e.id === this.dossierId));
        } else {
            this.dialogRef.close(null);
        }
    }
}
