import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { ClassementComponent } from './components/classement/classement.component';
import { DocumentStatisticComponent } from './components/document-statistic/document-statistic.component';
import { EvenementDossierComponent } from './components/evenement-dossier/evenement-dossier.component';
import { EvenenmentComponent } from './components/evenenment/evenenment.component';
import { NombreDocumentsComponent } from './components/nombre-documents/nombre-documents.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { RecapitulatifFinancierComponent } from './components/recapitulatif-financier/recapitulatif-financier.component';
import {
    RepartitionDossierTechnicienComponent
} from './components/repartition-dossier-technicien/repartition-dossier-technicien.component';
import { RepartitionTypeTravauxTechnicienComponent } from './components/repartition-type-travaux-technicien/repartition-type-travaux-technicien.component';
import { VentilationCaCommerciauxComponent } from './components/ventilation-ca-commerciaux/ventilation-ca-commerciaux.component';
import { VentilationVenteCategoryComponent } from './components/ventilation-vente-category/ventilation-vente-category.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { SuiviActiviteComponent } from './containers/suivi-activite/suivi-activite.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/menu/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
        { prefix: './assets/i18n/dashboard/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        DashboardComponent,
        DocumentStatisticComponent,
        NotificationsComponent,
        EvenenmentComponent,
        ClassementComponent,
        RecapitulatifFinancierComponent,
        NombreDocumentsComponent,
        EvenementDossierComponent,
        VentilationCaCommerciauxComponent,
        RepartitionTypeTravauxTechnicienComponent,
        RepartitionDossierTechnicienComponent,
        SuiviActiviteComponent,
        VentilationVenteCategoryComponent,
    ],
    imports: [
        SharedModule,
        DashboardRoutingModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
    ],
    providers: [],
})
export class DashboardModule { }
