import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BaseEditTemplateComponent } from 'app/shared/base-features/base-edit.component';
import { ModeEnum } from 'app/core/enums/mode.enum';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { UserHelper } from 'app/core/helpers/user';
import { TranslationService } from 'app/core/layout';
import { ToastService } from 'app/core/layout/services/toast.service';
import { Address } from 'app/core/models/general/address.model';
import { IDropDownItem } from 'app/core/models/general/drop-down-item.model';
import { IUser, IUserModel } from '../../user.model';

@Component({
    selector: 'kt-users-edit',
    templateUrl: './edit.component.html'
})
export class EditComponent extends BaseEditTemplateComponent<IUserModel> implements OnInit {

    @Input() mode: ModeEnum;
    @Input() form: FormGroup;

    @Input() set User(val: IUser) {
        this.form.reset();
        if (val != null) {
            this.setUserInForm(val);
        }
        if (this.isShowMode()) {
            this.form.disable();
        }
    }

    /** the enumeration of roles */
    roles: IDropDownItem<number, string>[] = [];

    /** the address of technicien */
    address: Address;

    constructor(
        private translate: TranslateService,
        private translationService: TranslationService,
        private toastService: ToastService) {
        super();
    }

    async ngOnInit() {
        await this.translationService.setLanguage(this.translate).toPromise();
        this.roles = this.getRoles();
    }

    /**
     * get list roles
     */
    getRoles(): IDropDownItem<number, string>[] {

        const roles: IDropDownItem<number, string>[] = [
            { value: UserProfile.Technicien, text: `ROLES.${UserProfile.Technicien}` },
            { value: UserProfile.Controleur, text: `ROLES.${UserProfile.Controleur}` },
            { value: UserProfile.Directeur, text: `ROLES.${UserProfile.Directeur}` },
            { value: UserProfile.Commercial, text: `ROLES.${UserProfile.Commercial}` },
        ];

        if (UserHelper.getAgenceId() == null) {
            roles.unshift({ value: UserProfile.Admin, text: `ROLES.${UserProfile.Admin}` });
        }

        return roles;
    }

    /**
     * set user in form
     */
    setUserInForm(user: IUser) {
        this.form.setValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            userName: user.userName,
            isActive: user.isActive,
            registrationNumber: user.registrationNumber,
            roleId: user.roleId,
            password: ''
        });
        this.form.get('password').disable();
    }

    /**
     * save user
     */
    save() {
        if (this.form.valid) {
            if (this.isEditMode()) {
                this.editEvent.emit(this.buildUserObjectUser());
            } else {
                this.addEvent.emit(this.buildUserObjectUser());
            }
        } else {
            this.toastService.warning(this.translate.instant('ERRORS.FILL_ALL'));
            this.form.markAllAsTouched();
        }
    }

    /**
     * set address event
     */
    setAddress(address: Address) {
        this.address = address;
    }

    /**
     * build user object
     */
    buildUserObjectUser(): IUserModel {
        const userModel: IUserModel = { ...this.form.value };
        if (userModel.isActive == null) {
            userModel.isActive = false;
        }
        userModel.agenceId = UserHelper.getAgenceId();
        return userModel;
    }
}
