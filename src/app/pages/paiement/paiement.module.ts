import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { DetailComponent } from './components/detail/detail.component';
import { EditComponent } from './components/edit/edit.component';
import { IndexComponent } from './components/index/index.component';
import { MouvementCompteACompteComponent } from './components/mouvement-compte-acompte/mouvement-compte-acompte.component';
import { PaiementShellComponent } from './container/paiement-shell/paiement-shell.component';
import { PaiementRoutingModule } from './paiement-routing.module';
import { PaiementGroupComponent } from './components/paiement-group/paiement-group.component';
import { SharedModule } from 'app/shared/shared.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/paiement/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}
@NgModule({
    declarations: [
        PaiementShellComponent,
        IndexComponent,
        EditComponent,
        DetailComponent,
        MouvementCompteACompteComponent,
        PaiementGroupComponent
    ],
    imports: [
        PaiementRoutingModule,
        SharedModule,
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
export class PaiementModule { }
