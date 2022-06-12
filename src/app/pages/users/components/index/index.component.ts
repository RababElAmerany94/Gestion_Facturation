import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BaseIndexTemplateComponent } from 'app/shared/base-features/base-index.component';
import { ColumnType } from 'app/shared/data-table/data-table.component';
import { DialogHelper } from 'app/core/helpers/dialog';
import { IPagedResult } from 'app/core/models/general/result-model';
import { IUser, IUserDataTables, IChangeActivateUserModel } from '../../user.model';
import { UserProfile } from 'app/core/enums/user-role.enums';

@Component({
    selector: 'kt-users-index',
    templateUrl: './index.component.html'
})
export class IndexComponent extends BaseIndexTemplateComponent<IUserDataTables, string> implements OnInit {

    /**
     * change activate for user
     */
    @Output() changeVisibilityEvent = new EventEmitter<IChangeActivateUserModel>();

    /** change password emitter */
    @Output() changePasswordEvent = new EventEmitter<number>();

    @Input() set data(data: IPagedResult<IUser>) {
        if (data != null) {
            this.users = { ...data as IPagedResult<any> };
            this.users.value = data.value.map<IUserDataTables>(e => this.mapIUserIntoIUserDataTable(e));
        }
    }

    /** the list of users */
    users: IPagedResult<IUserDataTables>;

    userProfile: typeof UserProfile = UserProfile;

    constructor(
        private translate: TranslateService,
        private matDialog: MatDialog
    ) {
        super();
        this.setModule(this.modules.Users);
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
                name: 'createdOn',
                nameTranslate: 'LABELS.CREATION_DATE',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'email',
                nameTranslate: 'CONTACTS.EMAIL',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'lastConnection',
                nameTranslate: 'LABELS.LAST_CONNECTION',
                isOrder: true,
                type: ColumnType.Date
            },
            {
                name: 'phoneNumber',
                nameTranslate: 'LABELS.PHONE_NUMBER',
                isOrder: true,
                type: ColumnType.any
            },
            {
                name: 'roleId',
                nameTranslate: 'LABELS.ROLE',
                isOrder: true,
                type: ColumnType.Translate
            },
            {
                name: 'userName',
                nameTranslate: 'LABELS.USERNAME',
                isOrder: true,
                type: ColumnType.any
            }
        ];
    }

    /**
     * mapping user to user dataTables
     * @param user the user information
     */
    mapIUserIntoIUserDataTable(user: IUser): IUserDataTables {
        const userDataTables: IUserDataTables = {
            firstName: user.firstName,
            lastName: user.lastName,
            createdOn: user.createdOn,
            email: user.email,
            id: user.id,
            isActive: user.isActive,
            lastConnection: user.lastConnection,
            phoneNumber: user.phoneNumber,
            roleId: `ROLES.${user.roleId}`,
            userName: user.userName
        };

        return userDataTables;
    }

    // #region click events

    /**
     * delete click
     */
    deleteClick(id: string) {
        DialogHelper.openConfirmDialog(this.matDialog, {
            header: this.translate.instant('LIST.DELETE.HEADER'),
            message: this.translate.instant('LIST.DELETE.MESSAGE'),
            cancel: this.translate.instant('LABELS.CANCEL'),
            confirm: this.translate.instant('LABELS.CONFIRM_DELETE_LE')
        }, () => {
            this.deleteEvent.emit(id);
        });

    }

    /**
     * change password of user
     */
    changePasswordClick(userId: number) {
        this.changePasswordEvent.emit(userId);
    }

    //#endregion

    // #region click events

    /**
     * active user
     */
    activeClick(id: string) {
        this.changeVisibilityEvent.emit({ id, isActive: true });
    }

    /**
     * deactivate user
     */
    deactivateClick(id: string) {
        this.changeVisibilityEvent.emit({ id, isActive: false });
    }
    //#endregion
}
