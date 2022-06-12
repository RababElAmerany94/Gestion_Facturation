import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { DetailComponent } from './components/detail/detail.component';
import { EditComponent } from './components/edit/edit.component';
import { IndexComponent } from './components/index/index.component';
import { UsersShellComponent } from './containers/users-shell/users-shell.component';
import { UsersRoutingModule } from './users-routing.module';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { SharedModule } from 'app/shared/shared.module';
import { GoogleAgendaComponent } from './components/google-agenda/google-agenda.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/users/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        UsersShellComponent,
        IndexComponent,
        EditComponent,
        DetailComponent,
        ProfileUserComponent,
        GoogleAgendaComponent
    ],
    imports: [
        SharedModule,
        UsersRoutingModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        })
    ]
})
export class UsersModule { }
