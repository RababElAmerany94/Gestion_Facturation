import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';

import { DevisRoutingModule } from './devis-routing.module';
import { DevisShellComponent } from './containers/devis-shell/devis-shell.component';
import { EditComponent } from './components/edit/edit.component';
import { IndexComponent } from './components/index/index.component';
import { DetailComponent } from './components/detail/detail.component';
import { SharedModule } from 'app/shared/shared.module';
import { StatusComponent } from './components/status/status.component';
import { PopUpStatusComponent } from './components/pop-up-status/pop-up-status.component';
import { SignatureDevisComponent } from './components/signature-devis/signature-devis.component';
import { AcompteComponent } from './components/acompte/acompte.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/devis/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        DevisShellComponent,
        EditComponent,
        IndexComponent,
        DetailComponent,
        StatusComponent,
        PopUpStatusComponent,
        SignatureDevisComponent,
        AcompteComponent
    ],
    imports: [
        DevisRoutingModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        })
    ],
})
export class DevisModule { }
