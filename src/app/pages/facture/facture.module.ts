import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { DetailComponent } from './components/detail/detail.component';
import { EditComponent } from './components/edit/edit.component';
import { ExportReleveFactureComponent } from './components/export-releve-facture/export-releve-facture.component';
import { FactureGroupComponent } from './components/facture-group/facture-group.component';
import { FactureStatusComponent } from './components/facture-status/facture-status.component';
import { IndexComponent } from './components/index/index.component';
import { PaiementByAvoirComponent } from './components/paiement/paiement-by-avoir/paiement-by-avoir.component';
import { PaiementComponent } from './components/paiement/paiement.component';
import { SimplePaiementComponent } from './components/paiement/simple-paiement/simple-paiement.component';
import { FactureShellComponent } from './containers/facture-shell/facture-shell.component';
import { FactureRoutingModule } from './facture-routing.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/facture/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        FactureShellComponent,
        IndexComponent,
        EditComponent,
        DetailComponent,
        FactureStatusComponent,
        FactureGroupComponent,
        ExportReleveFactureComponent,
        PaiementComponent,
        SimplePaiementComponent,
        PaiementByAvoirComponent,
    ],
    imports: [
        SharedModule,
        FactureRoutingModule,
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
export class FactureModule { }
