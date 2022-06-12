import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';
import { AppSettings } from 'app/app-settings/app-settings';
import { NumerationType } from 'app/core/enums/numerotation.enum';
import { ResultStatus } from 'app/core/enums/result-status';
import { UserRouteActions } from 'app/core/enums/users-route-actions.enum';
import { DialogHelper } from 'app/core/helpers/dialog';
import { StringHelper } from 'app/core/helpers/string';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { IFilterOption } from 'app/core/models/general/filter-option.model';
import { IPagedResult } from 'app/core/models/general/result-model';
import { NumerationService } from 'app/pages/parametres/numerotation/numerotation.service';
import { BaseContainerTemplateComponent } from 'app/shared/base-features/base-container.component';
import { ChangePasswordComponent } from 'app/shared/change-password/change-password.component';
import { IChangeActivateUserModel, IUser, IUserModel } from '../../user.model';
import { UsersService } from '../../users.service';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { Memo } from 'app/core/models/general/memo.model';

@Component({
    selector: 'kt-users-shell',
    templateUrl: './users-shell.component.html'
})
export class UsersShellComponent extends BaseContainerTemplateComponent implements OnInit {

    users: IPagedResult<IUser>;
    user: IUser;
    filterOption: IFilterOption;
    form: FormGroup;

    /** redirect url */
    redirectUrl: string;

    constructor(
        protected translate: TranslateService,
        private translationService: TranslationService,
        private usersService: UsersService,
        protected toastService: ToastService,
        private numerationService: NumerationService,
        private dialog: MatDialog,
        private fb: FormBuilder,
        protected router: Router,
        private route: ActivatedRoute
    ) {
        super(translate, toastService, router);
        this.setModule(this.modules.Users);
        this.subscribeDataFromRoute();
    }

    ngOnInit() {
        this.translationService.setLanguage(this.translate);
    }

    //#region routes

    /**
     * subscribe data from route
     */
    private subscribeDataFromRoute() {
        const navigationData = this.router.getCurrentNavigation()?.extras?.state;
        this.route.queryParams.subscribe(queryParams => {
            if (!StringHelper.isEmptyOrNull(queryParams?.mode)) {
                const mode = parseInt(queryParams.mode, 10) as ModeEnum | UserRouteActions;
                switch (mode) {
                    case ModeEnum.List:
                        this.modeList();
                        break;

                    case ModeEnum.Add:
                        this.addEvent();
                        break;

                    case ModeEnum.Edit:
                        this.editEvent(queryParams.id);
                        break;

                    case ModeEnum.Show:
                        this.showEvent(queryParams.id);
                        break;

                    case UserRouteActions.EditFromClient:
                        this.user = navigationData?.user;
                        this.redirectUrl = navigationData?.redirectUrl;
                        this.initForm();
                        this.modeEdit(this.user.id);
                        break;
                }
            }
        });
    }

    //#endregion

    //#region form

    /**
     * initialization form
     */
    initForm() {
        this.form = this.fb.group({
            firstName: [null, [Validators.required]],
            lastName: [null, [Validators.required]],
            email: [null, [Validators.pattern(AppSettings.regexEmail)]],
            phoneNumber: [null, [Validators.pattern(AppSettings.regexPhone)]],
            userName: [null, [Validators.required]],
            password: [null, [Validators.required, Validators.minLength(7)]],
            isActive: [false],
            registrationNumber: [null, [Validators.required]],
            roleId: [null, [Validators.required]]
        });
    }

    //#endregion

    // #region services

    /**
     * get user as paged
     */
    getUsers(filterOption: IFilterOption) {
        this.subs.sink = this.usersService.GetAsPagedResult(filterOption)
            .subscribe(result => {
                if (result.status === ResultStatus.Succeed) {
                    this.filterOption = filterOption;
                    this.users = result;
                } else {
                    this.toastErrorServer();
                }
            });
    }

    /**
     * get user by id
     * @param id the id of entity user
     */
    getUserById(id: string, callback: (user: IUser) => void) {
        this.usersService.Get(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                callback(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * generate matricule
     */
    generateMatricule() {
        this.numerationService.GenerateNumerotation(NumerationType.USER).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.form.get('registrationNumber').setValue(result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * check username and password are unique
     * @param callback the callback
     */
    CheckUsernameAndMatricleIsUnique(userModel: IUserModel, isAdd: boolean, callback) {
        const calls = [
            this.usersService.IsUniqueUsername(userModel.userName),
            this.usersService.isUniqueMatricule(userModel.registrationNumber)
        ];

        this.subs.sink = forkJoin(calls).subscribe((result) => {

            if (
                result[1].status === ResultStatus.Succeed &&
                !result[1].value &&
                (isAdd ? true : this.user.registrationNumber !== userModel.registrationNumber)
            ) {
                this.toastService.error(this.translate.instant('ERRORS.MATRICULE_NOT_UNIQUE'));
                callback(false);
                return;
            }
            if (
                result[0].status === ResultStatus.Succeed &&
                !result[0].value &&
                (isAdd ? true : this.user.userName !== userModel.userName)
            ) {
                this.toastService.error(this.translate.instant('ERRORS.USERNAME_NOT_UNIQUE'));
                callback(false);
                return;
            }

            callback(true);
        });
    }

    /**
     * add new user
     */
    addUser(userModel: IUserModel) {
        this.CheckUsernameAndMatricleIsUnique(userModel, true, (callbackResult: boolean) => {
            if (callbackResult) {
                this.subs.sink = this.usersService.Add(userModel).subscribe(result => {
                    if (result.status === ResultStatus.Succeed) {
                        this.toastAddSuccess();
                        this.setModeList();
                    } else {
                        this.toastErrorServer();
                    }
                });
            }
        });
    }

    /**
     * edit user
     */
    editUser(userModel: IUserModel) {
        this.subs.sink = this.usersService.Update(this.user.id, userModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.setModeList(() => {
                    localStorage.setItem(AppSettings.NAME, result.value.fullName);
                });
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * delete user
     */
    deleteUser(id: string) {
        this.subs.sink = this.usersService.Delete(id).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastDeleteSuccess();
                this.getUsers(this.filterOption);
                this.setModeList();
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * change activate user
     */
    ChangeActivateUserEvent(changeModel: IChangeActivateUserModel) {
        this.subs.sink = this.usersService.ChangeActivateUser(changeModel).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
                this.updateActive(changeModel.id, result.value);
            } else {
                this.toastErrorServer();
            }
        });
    }

    /**
     * update active user
     */
    updateActive(userId: string, isActive: boolean) {
        const agenceIndex = this.users.value.findIndex(e => e.id === userId);
        this.users.value[agenceIndex].isActive = isActive;
        this.users = JSON.parse(JSON.stringify(this.users));
    }

    /**
     * update calendar google
     */
    saveCalendarId(calendarId: string) {
        const userId = this.user.id;
        this.usersService.UpdateGoogleCalendarId(userId, calendarId).subscribe(result => {
            if (result.status === ResultStatus.Succeed) {
                this.toastEditSuccess();
            } else {
                this.toastErrorServer();
            }
        })
    }

    // #endregion

    // #region memos

    /**
     * add memo to user object
     */
    saveMemoToUser(memos: Memo[]) {
        this.subs.sink = this.usersService.SaveMemos(this.user.id, memos).subscribe(ce => {
            if (ce.status === ResultStatus.Succeed) {
                this.toastSaveSuccess();
                this.user.memos = memos;
            }
        });
    }

    // #endregion

    //#region change password

    /**
     * change password dialog
     */
    changePassword(userId: number) {
        DialogHelper.openDialog(this.dialog, ChangePasswordComponent, DialogHelper.SIZE_SMALL, { userId });
    }

    //#endregion

    // #region events

    /**
     * add event
     */
    addEvent() {
        this.user = null;
        this.initForm();
        this.generateMatricule();
        this.modeAdd();
    }

    /**
     * edit event
     */
    editEvent(id: string) {
        this.getUserById(id, (user) => {
            this.user = user;
            this.initForm();
            this.modeEdit(id);
        });
    }

    /**
     * show event
     */
    showEvent(id: string) {
        this.getUserById(id, (user) => {
            this.user = user;
            this.initForm();
            this.modeShow(id);
        });
    }

    setModeList(callbackRedirect: () => void = null) {
        if (!StringHelper.isEmptyOrNull(this.redirectUrl)) {
            if (callbackRedirect != null) {
                callbackRedirect();
            }
            this.router.navigate([this.redirectUrl]);
        } else {
            this.modeList();
        }
    }

    // #endregion
}
