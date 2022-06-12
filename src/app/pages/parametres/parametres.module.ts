import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';

// ngx-translate
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { EditBankAccountComponent } from './bank-account/components/edit-bank-account/edit-bank-account.component';
import { IndexBankAccountComponent } from './bank-account/components/index/index.component';
import { BankAccountShellComponent } from './bank-account/containers/bank-account-shell/bank-account-shell.component';
import { EditDocumentsCategoryComponent } from './document-category/components/edit-documents-category/edit-documents-category.component';
import { IndexDocumentsCategoryComponent } from './document-category/components/index-documents-category/index-documents-category.component';
import { DocumentsCategoryShellComponent } from './document-category/containers/documents-category-shell/documents-category-shell.component';
import { AvoirComponent } from './document-parameters/components/avoir/avoir.component';
import { DevisComponent } from './document-parameters/components/devis/devis.component';
import { EditComponent } from './document-parameters/components/edit/edit.component';
import { FactureComponent } from './document-parameters/components/facture/facture.component';
import { EditTvaComponent } from './document-parameters/components/tva/edit-tva/edit-tva.component';
import { TvaComponent } from './document-parameters/components/tva/tva.component';
import { DocumentParameterShellComponent } from './document-parameters/containers/document-parameter-shell/document-parameter-shell.component';
import { IndexMessagingComponent } from './messaging/component/index/index.component';
import { MessagingShellComponent } from './messaging/containers/messaging-shell/messaging-shell.component';
import { EditNumerotationComponent } from './numerotation/components/edit-numerotation/edit-numerotation.component';
import { IndexNumerotationComponent } from './numerotation/components/index/index.component';
// components
import { NumerotationShellComponent } from './numerotation/containers/numerotation-shell/numerotation-shell.component';
import { ParametresRoutingModule } from './parametres-routing.module';
import { EditPeriodComptableComponent } from './periode-comptable/components/edit/edit-period-comptable.component';
import { IndexPeriodCompatableComponent } from './periode-comptable/components/index/index-period-compatable.component';
import { PeriodComptableShellComponent } from './periode-comptable/container/period-comptable-shell/period-comptable-shell.component';
import { EditProductCategoryComponent } from './product-category/components/edit-product-category/edit-product-category.component';
import { IndexProductCategoryComponent } from './product-category/components/index-product-category/index-product-category.component';
import { ProductCategoryShellComponent } from './product-category/containers/product-category-shell/product-category-shell.component';
import { EditRegulationComponent } from './regulation-mode/components/edit-regulation/edit-regulation.component';
import { IndexRegulationComponent } from './regulation-mode/components/index-regulation/index-regulation.component';
import { ModeReglementShellComponent } from './regulation-mode/container/mode-reglement-shell/mode-reglement-shell.component';
import { SpecialArticleEditComponent } from './special-article/components/special-article-edit/special-article-edit.component';
import { SpecialArticleIndexComponent } from './special-article/components/special-article-index/special-article-index.component';
import { SpecialArticleShellComponent } from './special-article/container/special-article-shell/special-article-shell.component';
import { EditUniteComponent } from './unites/components/edit-unite/edit-unite.component';
import { IndexUniteComponent } from './unites/components/index/index.component';
import { UnitesShellComponent } from './unites/containers/unites-shell/unites-shell.component';
import { IndexTypeLogementComponent } from './type-logement/components/index-type-logement/index-type-logement.component';
import { EditTypeLogementComponent } from './type-logement/components/edit-type-logement/edit-type-logement.component';
import { TypeLogementShellComponent } from './type-logement/containers/type-logement-shell/type-logement-shell.component';
import { ModeleSmsComponent } from './modele-sms/containers/modele-sms/modele-sms.component';
import { EditModeleSmsComponent } from './modele-sms/components/edit-modele-sms/edit-modele-sms.component';
import { IndexModeleSmsComponent } from './modele-sms/components/index-modele-sms/index-modele-sms.component';
import { EditAgendaConfigComponent } from './agenda-config/components/edit-agenda-config/edit-agenda-config.component';
import { IndexAgendaConfigComponent } from './agenda-config/components/index-agenda-config/index-agenda-config.component';
import { AgendaConfigShellComponent } from './agenda-config/containers/agenda-config-shell/agenda-config-shell.component';
import { TypeChauffageShellComponent } from './type-chauffage/containers/type-chauffage-shell/type-chauffage-shell.component';
import { TypeChauffageEditComponent } from './type-chauffage/components/type-chauffage-edit/type-chauffage-edit.component';
import { TypeChauffageIndexComponent } from './type-chauffage/components/type-chauffage-index/type-chauffage-index.component';
import { AgendaTabsComponent } from './agenda-config/components/agenda-tabs/agenda-tabs.component';
import { IndexChampsComponent } from './champ-site-installation/components/index/index.component';
import { ChampSiteInstallationShellComponent } from './champ-site-installation/champ-site-installation-shell/champ-site-installation-shell.component';
import { EditChampComponent } from './champ-site-installation/components/edit-champ/edit-champ.component';
import { BonCommandeComponent } from './document-parameters/components/bonCommande/bon-commande.component';
import { SourceDuLeadShellComponent } from './source-du-lead/containers/source-du-lead-shell/source-du-lead-shell.component';
import { EditSourceDuLeadComponent } from './source-du-lead/components/edit-source-du-lead/edit-source-du-lead.component';
import { IndexSourceDuLeadComponent } from './source-du-lead/components/index-source-du-lead/index-source-du-lead.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/parametres/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        MessagingShellComponent,
        IndexMessagingComponent,
        NumerotationShellComponent,
        IndexNumerotationComponent,
        EditNumerotationComponent,
        IndexBankAccountComponent,
        BankAccountShellComponent,
        EditBankAccountComponent,
        EditComponent,
        DocumentParameterShellComponent,
        TvaComponent,
        FactureComponent,
        AvoirComponent,
        DevisComponent,
        EditTvaComponent,
        IndexPeriodCompatableComponent,
        PeriodComptableShellComponent,
        EditPeriodComptableComponent,
        EditRegulationComponent,
        IndexRegulationComponent,
        ModeReglementShellComponent,
        DocumentsCategoryShellComponent,
        IndexDocumentsCategoryComponent,
        EditDocumentsCategoryComponent,
        SpecialArticleShellComponent,
        SpecialArticleEditComponent,
        SpecialArticleIndexComponent,
        UnitesShellComponent,
        EditUniteComponent,
        IndexUniteComponent,
        ProductCategoryShellComponent,
        IndexProductCategoryComponent,
        EditProductCategoryComponent,
        AgendaConfigShellComponent,
        EditAgendaConfigComponent,
        IndexAgendaConfigComponent,
        IndexTypeLogementComponent,
        EditTypeLogementComponent,
        TypeLogementShellComponent,
        ModeleSmsComponent,
        EditModeleSmsComponent,
        IndexModeleSmsComponent,
        TypeChauffageShellComponent,
        TypeChauffageEditComponent,
        TypeChauffageIndexComponent,
        AgendaTabsComponent,
        ChampSiteInstallationShellComponent,
        IndexChampsComponent,
        EditChampComponent,
        BonCommandeComponent,
        SourceDuLeadShellComponent,
        EditSourceDuLeadComponent,
        IndexSourceDuLeadComponent
    ],
    imports: [
        ParametresRoutingModule,
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
export class ParametresModule { }
