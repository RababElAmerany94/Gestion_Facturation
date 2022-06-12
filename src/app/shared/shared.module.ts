// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// angular editor
import { AngularEditorModule } from '@kolkov/angular-editor';

// NgBootstrap
import { NgbDropdownModule, NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// ngx-translate
import { TranslateModule, TranslateService } from '@ngx-translate/core';

// directives
import { DirectivesModule } from 'app/directives/directive.module';
import { PortletModule } from 'app/modules/portlet/portlet.module';

// pipes
import { PipesModule } from 'app/pipes/pipes.module';

// svg module
import { InlineSVGModule } from 'ng-inline-svg';

// ngx-color-picker
import { ColorPickerModule } from 'ngx-color-picker';

// ngx-dropzone
import { NgxDropzoneModule } from 'ngx-dropzone';

// ngx-scroll-infinite
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// Core module
import { CoreModule } from '../core/core.module';

// angular material
import { MaterialModule } from '../material.module';

// angular date time picker
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from 'ng-pick-datetime';

// angular rating
import { NgxInputStarRatingModule } from '@ngx-lite/input-star-rating';

// components
import { BaseContainerTemplateComponent } from './base-features/base-container.component';
import { BaseEditTemplateComponent } from './base-features/base-edit.component';
import { BaseIndexTemplateComponent } from './base-features/base-index.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { CommercialsPlanningTableDetailsComponent } from
    './commercials-planning-table-details/commercials-planning-table-details.component';
import { CommercialsPlanningComponent } from './commercials-planning/commercials-planning.component';
import { ContactsComponent } from './contacts/contacts.component';
import { DossierPvComponent } from './dossier-pv/dossier-pv.component';
import { ConstatComblesComponent } from './dossier-pv/fiche-de-controle/constat-combles/constat-combles.component';
import { ConstatMursComponent } from './dossier-pv/fiche-de-controle/constat-murs/constat-murs.component';
import { ConstatPlanchersComponent } from './dossier-pv/fiche-de-controle/constat-planchers/constat-planchers.component';
import { FicheDeControleComponent } from './dossier-pv/fiche-de-controle/fiche-de-controle.component';
import { InformationFicheControleComponent } from './dossier-pv/fiche-de-controle/information-fiche-controle/information-fiche-controle.component';
import { EmailsComponent } from './emails/emails.component';
import { SendEmailComponent } from './emails/send-email/send-email.component';
import {
    AccessAppComponent, ActionNotificationComponent, AddAddressComponent,
    AddContactComponent, AddMemosComponent, AddPrixParQuantiteComponent, AddressDropDownComponent,
    AddressesComponent, BaseCustomUiComponent, BreadcrumbListComponent, CategorieProduitDropdownComponent,
    ChangePasswordComponent, ClientDropdownComponent, ConfigDialogComponent, CountriesDropdownComponent,
    CustomCheckboxComponent, CustomDatePickerComponent, CustomDropDownComponent, CustomEditorTextComponent,
    CustomErrorDisplayComponent, CustomInputComponent, CustomInputPasswordComponent, CustomLabelComponent,
    CustomModalComponent, CustomRadioButtonComponent, CustomTextareaComponent, CustomTimePickerComponent,
    CustomToggleButtonComponent, DataTableComponent, DepartmentsDropdownComponent, DetailArticleDialogComponent,
    DetailsHistoriqueComponent, DropdownAgenceComponent, DropdownTechniciensComponent,
    FilterSearchComponent, FournisseurDropdownComponent, HistoriquesComponent, LabelTagComponent, MatSelectSearchComponent,
    MemosComponent, NotificationComponent, OneAddressComponent, PrixParQuantiteComponent, ScrollTopComponent,
    SelectArticlesDialogComponent, ShowHideTableColumnsComponent, SplashScreenComponent, TableArticleShellComponent,
    UniteDropdownComponent, UserProfileComponent
} from './index';
import { InfoSiteInstallationComponent } from './info-site-installation/info-site-installation.component';
import { PreviewBase64Component } from './preview-base64/preview-base64.component';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { CustomDateTimeComponent } from './ui-material-elements/custom-date-time/custom-date-time.component';
import { CategorieDocumentComponent } from './ui-material-elements/dropdowns/categorie-document/categorie-document.component';
import { AddClientComponent } from './ui-material-elements/dropdowns/client-dropdown/add-client/add-client.component';
import { CommercialsPlanningDropdownComponent } from './ui-material-elements/dropdowns/commercials-planning-dropdown/commercials-planning-dropdown.component';
import { ContactDropdownComponent } from './ui-material-elements/dropdowns/contact-dropdown/contact-dropdown.component';
import { DropDownUsersComponent } from './ui-material-elements/dropdowns/drop-down-users/drop-down-users.component';
import { DropdownCommercialComponent } from './ui-material-elements/dropdowns/dropdown-commercial/dropdown-commercial.component';
import { PeriodComponent } from './ui-material-elements/dropdowns/period/period.component';
import { PrimeCEEDropdownComponent } from './ui-material-elements/dropdowns/prime-cee-dropdown/prime-cee-dropdown.component';
import { RegulationModeDropDownComponent } from './ui-material-elements/dropdowns/regulation-mode-drop-down/regulation-mode-drop-down.component';
import { PicturesViewComponent } from './pictures-view/pictures-view.component';
import { DelayDropDownComponent } from './ui-material-elements/dropdowns/delay-dropdown/delay-dropdown.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { CustomOwlDateTimeIntl } from 'app/core/intl/custom-owl-date-time-intl';
import { TypeLogementDropdownComponent } from './ui-material-elements/dropdowns/type-logement/type-logement-dropdown.component';
import { BankAccountDropDownComponent } from './ui-material-elements/dropdowns/bank-account-drop-down/bank-account-drop-down.component';
import { TableFactureAcompteComponent } from './table-facture-acompte/table-facture-acompte.component';
import { TableFactureClotureComponent } from './table-facture-cloture/table-facture-cloture.component';
import { SharedRelatedDocsComponent } from './shared-related-docs/shared-related-docs.component';
import { CustomMatMenuComponent } from './ui-material-elements/custom-mat-menu/custom-mat-menu.component';
import { SmsComponent } from './sms/sms.component';
import { SendSmsComponent } from './sms/send-sms/send-sms.component';
import { SelectModeleComponent } from './sms/select-modele/select-modele.component';
import { DossierDropdownComponent } from './ui-material-elements/dropdowns/dossier-dropdown/dossier-dropdown.component';
import { AddContactDropdownComponent } from './contacts/add-contact-dropdown/add-contact-dropdown.component';
import { AddAddressDropdownComponent } from './addresses/add-address-dropdown/add-address-dropdown.component';
import { TypeChauffageComponent } from './ui-material-elements/dropdowns/type-chauffage/type-chauffage.component';
import { DetailSmsComponent } from './sms/detail-sms/detail-sms.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FiltersDashboardComponent } from './dashboard/filters-dashboard/filters-dashboard.component';
import { ChiffreAffaireChartComponent } from './dashboard/chiffre-affaire-chart/chiffre-affaire-chart.component';
import { SituationComponent } from './situation/situation.component';
import { DialogSelectClientComponent } from './ui-material-elements/dropdowns/client-dropdown/dialog-select-client/dialog-select-client.component';
import { DialogSelectDossierComponent } from './ui-material-elements/dropdowns/dossier-dropdown/dialog-select-dossier/dialog-select-dossier.component';
import { AgendaEvenementDropdownComponent } from './ui-material-elements/dropdowns/agenda-evenement-dropdown/agenda-evenement-dropdown.component';
import { RelationClientComponent } from './relation-client/relation-client.component';
import { AddRelationClientComponent } from './relation-client/add-relation-client/add-relation-client.component';
import { SourceLeadDropdownComponent } from './ui-material-elements/dropdowns/source-lead-dropdown/source-lead-dropdown.component';
import { DisplayFileComponent } from './display-file/display-file.component';
import { AddLigneArticleComponent } from './table-article/components/add-ligne-article/add-ligne-article.component';
import { RaisonAnnulationComponent } from './raison-annulation/raison-annulation.component';

@NgModule({
    declarations: [
        ScrollTopComponent,
        SplashScreenComponent,
        NotificationComponent,
        UserProfileComponent,
        DataTableComponent,
        ShowHideTableColumnsComponent,
        CustomInputComponent,
        CustomRadioButtonComponent,
        CustomModalComponent,
        CustomTextareaComponent,
        CustomCheckboxComponent,
        CustomDatePickerComponent,
        CustomDateTimeComponent,
        CustomErrorDisplayComponent,
        CustomLabelComponent,
        AddAddressComponent,
        AddContactComponent,
        BaseCustomUiComponent,
        CustomDropDownComponent,
        AddressesComponent,
        ContactsComponent,
        CountriesDropdownComponent,
        DepartmentsDropdownComponent,
        MatSelectSearchComponent,
        ConfigDialogComponent,
        OneAddressComponent,
        CustomInputPasswordComponent,
        MemosComponent,
        AddMemosComponent,
        ChangePasswordComponent,
        DropdownTechniciensComponent,
        DropdownAgenceComponent,
        HistoriquesComponent,
        DetailsHistoriqueComponent,
        AccessAppComponent,
        PrixParQuantiteComponent,
        AddPrixParQuantiteComponent,
        CustomToggleButtonComponent,
        CustomEditorTextComponent,
        LabelTagComponent,
        UniteDropdownComponent,
        FournisseurDropdownComponent,
        ActionNotificationComponent,
        ClientDropdownComponent,
        FilterSearchComponent,
        TableArticleShellComponent,
        SelectArticlesDialogComponent,
        DetailArticleDialogComponent,
        AddressDropDownComponent,
        BreadcrumbListComponent,
        BaseContainerTemplateComponent,
        BaseEditTemplateComponent,
        BaseIndexTemplateComponent,
        EmailsComponent,
        SendEmailComponent,
        CustomTimePickerComponent,
        PeriodComponent,
        ColorPickerComponent,
        CategorieDocumentComponent,
        PrimeCEEDropdownComponent,
        ContactDropdownComponent,
        InfoSiteInstallationComponent,
        AddClientComponent,
        RegulationModeDropDownComponent,
        DropdownCommercialComponent,
        CategorieProduitDropdownComponent,
        CommercialsPlanningDropdownComponent,
        CommercialsPlanningComponent,
        CommercialsPlanningTableDetailsComponent,
        SearchbarComponent,
        DropDownUsersComponent,
        DossierPvComponent,
        FicheDeControleComponent,
        ConstatComblesComponent,
        ConstatMursComponent,
        ConstatPlanchersComponent,
        InformationFicheControleComponent,
        PicturesViewComponent,
        PreviewBase64Component,
        DelayDropDownComponent,
        TypeLogementDropdownComponent,
        BankAccountDropDownComponent,
        TableFactureAcompteComponent,
        TableFactureClotureComponent,
        SharedRelatedDocsComponent,
        CustomMatMenuComponent,
        SmsComponent,
        SendSmsComponent,
        SelectModeleComponent,
        DossierDropdownComponent,
        AddContactDropdownComponent,
        AddAddressDropdownComponent,
        TypeChauffageComponent,
        DetailSmsComponent,
        ChiffreAffaireChartComponent,
        FiltersDashboardComponent,
        SituationComponent,
        DialogSelectClientComponent,
        DialogSelectDossierComponent,
        AgendaEvenementDropdownComponent,
        RelationClientComponent,
        AddRelationClientComponent,
        SourceLeadDropdownComponent,
        DisplayFileComponent,
        AddLigneArticleComponent,
        RaisonAnnulationComponent
    ],
    exports: [
        ScrollTopComponent,
        SplashScreenComponent,
        NotificationComponent,
        UserProfileComponent,
        DataTableComponent,
        ShowHideTableColumnsComponent,
        CustomInputComponent,
        CustomRadioButtonComponent,
        CustomModalComponent,
        CustomTextareaComponent,
        CustomCheckboxComponent,
        CustomDatePickerComponent,
        CustomDateTimeComponent,
        CustomErrorDisplayComponent,
        CustomLabelComponent,
        AddAddressComponent,
        AddContactComponent,
        BaseCustomUiComponent,
        CustomDropDownComponent,
        AddressesComponent,
        ContactsComponent,
        MatSelectSearchComponent,
        OneAddressComponent,
        CustomInputPasswordComponent,
        MemosComponent,
        DropdownTechniciensComponent,
        DropdownAgenceComponent,
        HistoriquesComponent,
        DetailsHistoriqueComponent,
        AccessAppComponent,
        PrixParQuantiteComponent,
        CustomEditorTextComponent,
        CustomToggleButtonComponent,
        LabelTagComponent,
        UniteDropdownComponent,
        FournisseurDropdownComponent,
        FilterSearchComponent,
        TableArticleShellComponent,
        SelectArticlesDialogComponent,
        AddressDropDownComponent,
        BreadcrumbListComponent,
        BaseContainerTemplateComponent,
        BaseEditTemplateComponent,
        BaseIndexTemplateComponent,
        EmailsComponent,
        CustomTimePickerComponent,
        PeriodComponent,
        ColorPickerComponent,
        CategorieDocumentComponent,
        PrimeCEEDropdownComponent,
        ContactDropdownComponent,
        InfoSiteInstallationComponent,
        AddClientComponent,
        RegulationModeDropDownComponent,
        DropdownCommercialComponent,
        CategorieProduitDropdownComponent,
        ClientDropdownComponent,
        CommercialsPlanningDropdownComponent,
        CommercialsPlanningComponent,
        CommercialsPlanningTableDetailsComponent,
        SearchbarComponent,
        DropDownUsersComponent,
        DossierPvComponent,
        FicheDeControleComponent,
        ConstatComblesComponent,
        ConstatMursComponent,
        ConstatPlanchersComponent,
        InformationFicheControleComponent,
        DelayDropDownComponent,
        TypeLogementDropdownComponent,
        TableFactureAcompteComponent,
        BankAccountDropDownComponent,
        TableFactureClotureComponent,
        SharedRelatedDocsComponent,
        CustomMatMenuComponent,
        SmsComponent,
        DossierDropdownComponent,
        ChiffreAffaireChartComponent,
        FiltersDashboardComponent,
        SituationComponent,
        DialogSelectClientComponent,
        AgendaEvenementDropdownComponent,
        RelationClientComponent,
        AddRelationClientComponent,
        DisplayFileComponent,
        PdfViewerModule,
        RaisonAnnulationComponent,

        CommonModule,
        CoreModule,
        MaterialModule,
        PortletModule,
        ReactiveFormsModule,
        FormsModule,

        // infinite scroll
        InfiniteScrollModule,

        // start rating
        NgxInputStarRatingModule,

        // directives module
        DirectivesModule,

        // pipe module
        PipesModule,

        // ngx-dropzone
        NgxDropzoneModule,

        NgxChartsModule
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        PerfectScrollbarModule,
        InlineSVGModule,
        CoreModule,
        PortletModule,
        ColorPickerModule,
        PdfViewerModule,

        // ng-bootstrap modules
        NgbDropdownModule,
        NgbTabsetModule,
        NgbTooltipModule,

        // translate module
        TranslateModule.forChild(),

        // angular material
        MaterialModule,

        // ngx-dropzone
        NgxDropzoneModule,

        // angular editor
        AngularEditorModule,

        // ngx-scroll-infinite
        InfiniteScrollModule,

        // directives module
        DirectivesModule,

        // pipe module
        PipesModule,

        // angular date time picker
        OwlDateTimeModule,
        OwlNativeDateTimeModule,

        // ui-loader
        NgxUiLoaderModule,
        NgxInputStarRatingModule,

        // ngx chart
        NgxChartsModule
    ],
    providers: [
        {
            provide: OwlDateTimeIntl,
            useFactory: (translate: TranslateService) => {
                const service = new CustomOwlDateTimeIntl();
                service.injectTranslateService(translate);
                return service;
            },
            deps: [TranslateService]
        },
    ]
})
export class SharedModule { }
