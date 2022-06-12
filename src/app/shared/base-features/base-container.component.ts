import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Access } from 'app/core/enums/access.enum';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { UserHelper } from 'app/core/helpers/user';
import { ToastService } from 'app/core/layout/services/toast.service';
import { SubSink } from 'subsink';
import { BasePermissions } from './base-permissions';

@Component({
    selector: 'kt-base-container-template',
    template: ''
})
export class BaseContainerTemplateComponent extends BasePermissions implements OnDestroy {

    subs = new SubSink();
    modes: typeof ModeEnum = ModeEnum;
    mode = ModeEnum.List;
    isMainRoute = true;

    /** loading data dashboard */
    loading = false;

    constructor(
        protected translate: TranslateService,
        protected toastService: ToastService,
        protected router: Router
    ) {
        super();
    }

    // #region modes
    isShowMode = () => this.mode === ModeEnum.Show;
    isEditMode = () => this.mode === ModeEnum.Edit;
    isAddMode = () => this.mode === ModeEnum.Add;
    isListMode = () => this.mode === ModeEnum.List;
    // #endregion

    //#region changes modes

    modeEdit(id: string) {
        if (UserHelper.hasPermission(this.module, Access.Update)) {
            this.mode = ModeEnum.Edit;
            if (this.isMainRoute)
                this.router.navigate([], { queryParams: { mode: this.mode, id } });
        } else {
            this.goHome();
        }
    }

    modeAdd(mode: number = ModeEnum.Add) {
        if (UserHelper.hasPermission(this.module, Access.Create)) {
            this.mode = ModeEnum.Add
            if (this.isMainRoute)
                this.router.navigate([], { queryParams: { mode } });
        } else {
            this.goHome();
        }
    }

    modeShow(id: string) {
        if (UserHelper.hasPermission(this.module, Access.Read)) {
            this.mode = ModeEnum.Show;
            if (this.isMainRoute)
                this.router.navigate([], { queryParams: { mode: this.mode, id } });
        } else {
            this.goHome();
        }
    }

    modeList() {
        if (UserHelper.hasPermission(this.module, Access.Read)) {
            this.mode = ModeEnum.List
            if (this.isMainRoute)
                this.router.navigate([], { queryParams: { mode: this.mode } });
        } else {
            this.goHome();
        }
    };

    //#endregion

    //#region toasts
    toastErrorServer = () => this.toastService.error(this.translate.instant('ERRORS.SERVER'));
    toastErrorUploadFile = () => this.toastService.success(this.translate.instant('ERRORS.UPLOAD_FILE'));
    toastAddSuccess = () => this.toastService.success(this.translate.instant('SUCCESS.ADD'));
    toastSaveSuccess = () => this.toastService.success(this.translate.instant('SUCCESS.SAVE'));
    toastEditSuccess = () => this.toastService.success(this.translate.instant('SUCCESS.EDIT'));
    toastDeleteSuccess = () => this.toastService.success(this.translate.instant('SUCCESS.DELETE'));
    //#endregion

    //#region helpers

    private goHome() {
        this.router.navigateByUrl('/');
    }

    //#endregion

    ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
