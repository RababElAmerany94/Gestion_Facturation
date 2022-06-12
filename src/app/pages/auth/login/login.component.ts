import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SubSink } from 'subsink';
import { UserProfile } from 'app/core/enums/user-role.enums';
import { AuthService } from 'app/core/auth/auth.service';
import { AppSettings } from 'app/app-settings/app-settings';
import { ToastService } from 'app/core/layout/services/toast.service';
import { UserHelper } from 'app/core/helpers/user';
import { MenuConfigService } from 'app/core/layout';
import { MenuConfig } from 'app/core/layout/_config/menu.config';

@Component({
    selector: 'kt-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit, OnDestroy {

    loginForm: FormGroup;
    loading = false;
    subsink = new SubSink();
    hide = true;

    listAccessProfiles = [
        UserProfile.Admin,
        UserProfile.Controleur,
        UserProfile.Commercial,
        UserProfile.Directeur,
        UserProfile.AdminAgence
    ];

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private toast: ToastService,
        private translate: TranslateService,
        private menuConfigService: MenuConfigService
    ) { }

    /**
     * On init
     */
    async ngOnInit() {
        this.initLoginForm();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.loading = false;
        this.subsink.unsubscribe();
    }

    /**
     * Form initalization
     * Default params, validators
     */
    initLoginForm() {
        this.loginForm = this.fb.group({
            userName: [null, [Validators.required]],
            password: [null, [Validators.required]
            ]
        });
    }

    /**
     * Form Submit
     */
    submit() {
        if (this.loginForm.valid) {
            const formData = this.loginForm.value;
            this.loading = true;
            this.authService.login(formData.userName, formData.password).subscribe(res => {
                const hasAccess = this.listAccessProfiles.filter(x => x === res.roleId).length > 0;
                if (res.actif && hasAccess) {
                    localStorage.setItem(AppSettings.TOKEN, res.token);
                    localStorage.setItem(AppSettings.ROLE_ID, res.roleId.toString());
                    localStorage.setItem(AppSettings.NAME, UserHelper.getTokeInfo().name);
                    this.loading = false;
                    this.menuConfigService.loadConfigs(UserHelper.modulePermitted(MenuConfig.configs));
                    this.router.navigate(['/']);
                } else if (!hasAccess) {
                    this.toast.error(this.translate.instant('ERRORS.NO_ACCESS'));
                    this.loading = false;

                } else if (!res.actif) {
                    this.toast.error(this.translate.instant('ERRORS.INVACTIVE_ACCOUNT'));
                    this.loading = false;
                }

            }, err => {
                this.toast.error(this.translate.instant('ERRORS.INCORRECT_CONNECTION'));
                this.loading = false;
            });
        } else {
            this.loginForm.markAllAsTouched();
            this.loading = false;
        }
    }
}
