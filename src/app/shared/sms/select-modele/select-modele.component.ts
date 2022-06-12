import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { IModeleSMS } from './../../../pages/parametres/modele-sms/modele-sms.model';
import { ModeleSMSService } from './../../../pages/parametres/modele-sms/modele-sms.service';
import { SortDirection } from './../../../core/enums/sort-direction';
import { ResultStatus } from './../../../core/enums/result-status';
import { AppSettings } from './../../../app-settings/app-settings';

@Component({
    selector: 'kt-select-modele',
    templateUrl: './select-modele.component.html'
})
export class SelectModeleComponent implements OnInit {

    smsModel: IModeleSMS[];

    /** search control */
    searchControl = new FormControl();

    constructor(
        private dialogRef: MatDialogRef<SelectModeleComponent>,
        private modeleSMSService: ModeleSMSService
    ) {
        this.getModeleSMS();
        this.subscribeSearchControl();
    }

    ngOnInit(): void {
    }

    //#region init component

    /**
     * initialization component
     */
    getModeleSMS(searchQuery?: string) {
        this.modeleSMSService.GetAsPagedResult({
            SearchQuery: searchQuery,
            OrderBy: 'id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
        }).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.smsModel = result.value;
            }
        });
    }

    /**
     * subscribe change in search control
     */
    subscribeSearchControl() {
        this.searchControl.valueChanges
            .pipe(debounceTime(700), distinctUntilChanged())
            .subscribe(result => {
                this.getModeleSMS(result);
            });
    }

    //#endregion

    //#region setter and getter view

    /**
     * select event
     */
    selectModelSMS(smsModel: IModeleSMS) {
        this.dialogRef.close(smsModel);
    }

    //#endregion
}
