import { NgModule } from '@angular/core';
import { EditComponent } from './components/edit/edit.component';
import { IndexComponent } from './components/index/index.component';
import { DetailComponent } from './components/detail/detail.component';
import { SharedModule } from 'app/shared/shared.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { StatusComponent } from './components/status/status.component';
import { BonCommandeShellComponent } from './containers/bon-commande-shell/bon-commande-shell.component';
import { BonCommadeRoutingModule } from './bon-commande-routing.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/bon-commande/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        EditComponent,
        IndexComponent,
        DetailComponent,
        BonCommandeShellComponent,
        StatusComponent
    ],
    imports: [
        SharedModule,
        BonCommadeRoutingModule,
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
export class BonCommandeModule { }
