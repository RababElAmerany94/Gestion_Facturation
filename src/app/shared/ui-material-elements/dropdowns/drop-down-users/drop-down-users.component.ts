import { Component, OnInit, Input } from '@angular/core';
import { BaseCustomUiComponent } from '../../base-custom-ui/base-custom-ui.component';
import { UsersService } from 'app/pages/users/users.service';
import { IUser } from 'app/pages/users/user.model';
import { SortDirection } from 'app/core/enums/sort-direction';
import { AppSettings } from 'app/app-settings/app-settings';
import { IUserFilterOption } from '../../../../core/models/general/filter-option.model';

@Component({
    selector: 'kt-drop-down-users',
    template: `
    <mat-form-field class="example-full-width" appearance="fill" [formGroup]="formInstant" >
        <mat-label>{{label}}</mat-label>
        <ng-container *ngIf="multiSelect;else singleSelect" >
            <mat-select [id]="inputName" [formControlName]="inputName" multiple>
            <mat-option *ngFor="let item of users" [value]="item?.id">
                {{item?.fullName }}
            </mat-option>
            </mat-select>
        </ng-container>
        <ng-template #singleSelect>
            <mat-select [id]="inputName" [formControlName]="inputName">
            <mat-option value=''>{{ 'LABELS.ANY' | translate }}</mat-option>
            <mat-option *ngFor="let item of users" [value]="item?.id">
                {{item?.fullName }}
            </mat-option>
            </mat-select>
        </ng-template>
    </mat-form-field>`
})
export class DropDownUsersComponent extends BaseCustomUiComponent implements OnInit {

    @Input()
    types: IUserFilterOption[] = [];

    /** the list of users */
    users: IUser[] = [];

    /** multi select technicien */
    @Input() multiSelect = false;

    constructor(private usersService: UsersService) {
        super();
    }
    /**
     * get list of users
     */
    getUsers() {
        this.usersService.GetAsPagedResult({
            SearchQuery: '',
            OrderBy: 'Id',
            SortDirection: SortDirection.Asc,
            Page: 1,
            PageSize: AppSettings.MAX_GET_DATA,
            rolesId: this.types
        }).subscribe(result => {
            this.users = result.value;
        });
    }

    /** init users */
    ngOnInit() {
        this.getUsers();
    }

}
