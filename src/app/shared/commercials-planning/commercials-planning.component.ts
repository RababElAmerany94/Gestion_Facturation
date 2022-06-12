import { Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SubSink } from 'subsink';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppSettings } from 'app/app-settings/app-settings';
import { ResultStatus } from 'app/core/enums/result-status';
import { SortDirection } from 'app/core/enums/sort-direction';
import { ICommercialPlanning } from 'app/pages/users/user.model';
import { UsersService } from 'app/pages/users/users.service';

@Component({
    selector: 'kt-commercials-planning',
    templateUrl: './commercials-planning.component.html'
})
export class CommercialsPlanningComponent {

    subs = new SubSink();

    /** date of RDV */
    dateRDV: Date;

    /** list of commercials planning */
    commercialsPlanning: ICommercialPlanning[] = [];

    /** search control */
    searchControl = new FormControl();

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: { dateRDV: Date },
        private dialogRef: MatDialogRef<CommercialsPlanningComponent>,
        private userService: UsersService
    ) {
        this.initComponent('');
        this.subscribeSearchControl();
    }

    //#region init component

    /**
     * initialization component
     */
    initComponent(searchQuery: string) {
        if (this.data != null) {
            this.dateRDV = this.data.dateRDV;
            this.getCommercialsPlanning(this.dateRDV, searchQuery);
        }
    }

    //#endregion

    //#region services

    /**
     * get list commercial planning
     */
    getCommercialsPlanning(dateRDV: Date, searchQuery: string) {
        this.subs.sink = this.userService.GetCommercialsPlanning({
            SearchQuery: searchQuery,
            OrderBy: 'firstName',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            dateRDV
        }).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.commercialsPlanning = result.value;
            }
        });
    }

    /**
     * subscribe change in search control
     */
    subscribeSearchControl() {
        this.subs.sink = this.searchControl.valueChanges
            .pipe(debounceTime(700), distinctUntilChanged())
            .subscribe(result => {
                this.initComponent(result);
            });
    }

    //#endregion

    //#region setter and getter view

    /**
     * select event
     */
    selectCommercial(commercialsPlanning: ICommercialPlanning) {
        this.dialogRef.close(commercialsPlanning);
    }

    //#endregion

}
