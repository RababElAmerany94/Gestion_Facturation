import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteName } from 'app/core/enums/route-name.enum';
import { BankAccountShellComponent } from './bank-account/containers/bank-account-shell/bank-account-shell.component';
import { DocumentsCategoryShellComponent } from './document-category/containers/documents-category-shell/documents-category-shell.component';
import { MessagingShellComponent } from './messaging/containers/messaging-shell/messaging-shell.component';
import { NumerotationShellComponent } from './numerotation/containers/numerotation-shell/numerotation-shell.component';
import { ProductCategoryShellComponent } from './product-category/containers/product-category-shell/product-category-shell.component';
import { ModeReglementShellComponent } from './regulation-mode/container/mode-reglement-shell/mode-reglement-shell.component';
import { SpecialArticleShellComponent } from './special-article/container/special-article-shell/special-article-shell.component';
import { UnitesShellComponent } from './unites/containers/unites-shell/unites-shell.component';
import { DocumentParameterShellComponent } from './document-parameters/containers/document-parameter-shell/document-parameter-shell.component';
import { TypeLogementShellComponent } from './type-logement/containers/type-logement-shell/type-logement-shell.component';
import { PeriodComptableShellComponent } from './periode-comptable/container/period-comptable-shell/period-comptable-shell.component';
import { ModeleSmsComponent } from './modele-sms/containers/modele-sms/modele-sms.component';
import { AgendaConfigShellComponent } from './agenda-config/containers/agenda-config-shell/agenda-config-shell.component';
import { TypeChauffageShellComponent } from './type-chauffage/containers/type-chauffage-shell/type-chauffage-shell.component';
import { ChampSiteInstallationShellComponent } from './champ-site-installation/champ-site-installation-shell/champ-site-installation-shell.component';
import { SourceDuLeadShellComponent } from './source-du-lead/containers/source-du-lead-shell/source-du-lead-shell.component';

const routes: Routes = [
    {
        path: `${RouteName.SourceDuLead}`,
        component: SourceDuLeadShellComponent
    },
    {
        path: `${RouteName.CategoryDocument}`,
        component: DocumentsCategoryShellComponent
    },
    {
        path: `${RouteName.ModeReglement}`,
        component: ModeReglementShellComponent
    },
    {
        path: `${RouteName.SpecialArticle}`,
        component: SpecialArticleShellComponent
    },
    {
        path: `${RouteName.Messaging}`,
        component: MessagingShellComponent
    },
    {
        path: `${RouteName.Numeration}`,
        component: NumerotationShellComponent
    },
    {
        path: `${RouteName.BankAccounts}`,
        component: BankAccountShellComponent
    },
    {
        path: `${RouteName.Unites}`,
        component: UnitesShellComponent
    },
    {
        path: `${RouteName.CategoryProduct}`,
        component: ProductCategoryShellComponent
    },
    {
        path: `${RouteName.ConfigurationAgenda}`,
        component: AgendaConfigShellComponent
    },
    {
        path: `${RouteName.TypeLogement}`,
        component: TypeLogementShellComponent
    },
    {
        path: `${RouteName.DocumentParameter}`,
        component: DocumentParameterShellComponent
    },
    {
        path: `${RouteName.PeriodComptable}`,
        component: PeriodComptableShellComponent
    },
    {
        path: `${RouteName.ModeleSMS}`,
        component: ModeleSmsComponent
    },
    {
        path: `${RouteName.TypeChauffage}`,
        component: TypeChauffageShellComponent
    },
    {
        path: `${RouteName.ChampSiteInstallation}`,
        component: ChampSiteInstallationShellComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ParametresRoutingModule { }
