import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClientsComponent } from './container/clients/clients.component';
import { ClientsRoutingModule } from './clients-routing.module';
import { IndexComponent } from './components/index/index.component';
import { EditComponent } from './components/edit/edit.component';
import { DetailComponent } from './components/detail/detail.component';
import { SharedModule } from 'app/shared/shared.module';
import { MaterialModule } from 'app/material.module';
import { PortletModule } from 'app/modules/portlet/portlet.module';
import { ClientTabsComponent } from './components/client-tabs/client-tabs.component';
import { DossierModule } from '../dossier/dossier.module';
import { AgendaCommercialModule } from '../agenda-commercial/agenda-commercial.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/dossier/', suffix: '.json' },
        { prefix: './assets/i18n/clients/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
        { prefix: './assets/i18n/login/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        ClientsComponent,
        IndexComponent,
        EditComponent,
        DetailComponent,
        ClientTabsComponent,
    ],
    imports: [
        CommonModule,
        ClientsRoutingModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        MaterialModule,
        PortletModule,
        DossierModule,
        AgendaCommercialModule
    ]
})
export class ClientsModule { }
