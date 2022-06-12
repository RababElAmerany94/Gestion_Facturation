// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// NgBootstrap
import { NgbProgressbarModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Translation
import { TranslateModule } from '@ngx-translate/core';
// Loading bar
import { LoadingBarModule } from '@ngx-loading-bar/core';

// Perfect Scrollbar
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';
// Core Module
import { HeaderComponent } from './header/header.component';
import { AsideLeftComponent } from './aside/aside-left.component';
import { FooterComponent } from './footer/footer.component';
import { BrandComponent } from './brand/brand.component';
import { TopbarComponent } from './header/topbar/topbar.component';
import { MenuHorizontalComponent } from './header/menu-horizontal/menu-horizontal.component';
import { BaseComponent } from './base/base.component';
import { HtmlClassService } from './html-class.service';
import { HeaderMobileComponent } from './header/header-mobile/header-mobile.component';
import { SharedModule } from 'app/shared/shared.module';
import { CoreModule } from 'app/core/core.module';
import { DirectivesModule } from 'app/directives/directive.module';

@NgModule({
    declarations: [
        BaseComponent,
        FooterComponent,

        // headers
        HeaderComponent,
        BrandComponent,
        HeaderMobileComponent,

        // topbar components
        TopbarComponent,

        // aside left menu components
        AsideLeftComponent,

        // horizontal menu components
        MenuHorizontalComponent,

    ],
    exports: [
        BaseComponent,
        FooterComponent,

        // headers
        HeaderComponent,
        BrandComponent,
        HeaderMobileComponent,

        // topbar components
        TopbarComponent,

        // aside left menu components
        AsideLeftComponent,

        // horizontal menu components
        MenuHorizontalComponent,

    ],
    providers: [
        HtmlClassService,
    ],
    imports: [
        CommonModule,
        RouterModule,
        SharedModule,
        PerfectScrollbarModule,
        FormsModule,
        TranslateModule.forChild(),
        LoadingBarModule,
        InlineSVGModule,
        CoreModule,
        // ng-bootstrap modules
        NgbProgressbarModule,
        NgbTooltipModule,
        DirectivesModule,
    ]
})
export class ThemeModule {
}
