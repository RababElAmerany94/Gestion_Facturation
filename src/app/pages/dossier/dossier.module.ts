import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { AgendaCommercialModule } from '../agenda-commercial/agenda-commercial.module';
import { AddDevisDocAssociateComponent } from './components/add-devis-doc-associate/add-devis-doc-associate.component';
import { AssignCommercialComponent } from './components/assign-commercial/assign-commercial.component';
import { DemandeDepuisWebComponent } from './components/demande-depuis-web/demande-depuis-web.component';
import { DetailComponent } from './components/detail/detail.component';
import { DocumentsAssociateComponent } from './components/documents-associate/documents-associate.component';
import { DossierInstallationComponent } from './components/dossier-installation/dossier-installation.component';
import { DossierStatusComponent } from './components/dossier-status/dossier-status.component';
import { DossierTabsComponent } from './components/dossier-tabs/dossier-tabs.component';
import { EditComponent } from './components/edit/edit.component';
import { IndexComponent } from './components/index/index.component';
import { DossierShellComponent } from './containers/dossier-shell/dossier-shell.component';
import { DossierRoutingModule } from './dossier-routing.module';
import { VisiteTechniqueComponent } from './components/visite-technique/visite-technique.component';
import { AddTypeVisiteTechniqueComponent } from './components/add-type-visite-technique/add-type-visite-technique.component';
import { AddVisiteTechniqueComponent } from './components/visite-technique/add-visite-technique/add-visite-technique.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/dossier/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        DetailComponent,
        EditComponent,
        IndexComponent,
        DossierShellComponent,
        DossierInstallationComponent,
        DossierStatusComponent,
        AddDevisDocAssociateComponent,
        AssignCommercialComponent,
        DossierTabsComponent,
        DemandeDepuisWebComponent,
        DocumentsAssociateComponent,
        VisiteTechniqueComponent,
        AddTypeVisiteTechniqueComponent,
        AddVisiteTechniqueComponent,
    ],
    imports: [
        DossierRoutingModule,
        SharedModule,
        AgendaCommercialModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        })
    ],
    exports: [
        DossierShellComponent
    ]
})
export class DossierModule { }
