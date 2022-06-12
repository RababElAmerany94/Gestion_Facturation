// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

// Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from 'app/shared/shared.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/login/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
    ]);
}

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent,
                data: { returnUrl: window.location.pathname }
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
            }
        ]
    }
];


@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(routes),
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        })
    ],
    providers: [],
    exports: [AuthComponent],
    declarations: [
        AuthComponent,
        LoginComponent,
        ForgotPasswordComponent
    ]
})
export class AuthModule {
}
