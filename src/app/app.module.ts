// Angular
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule, LOCALE_ID } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GestureConfig } from '@angular/material/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { OverlayModule } from '@angular/cdk/overlay';

// Perfect Scroll bar
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

// SVG inline
import { InlineSVGModule } from 'ng-inline-svg';

// Hammer JS
import 'hammerjs';

// Components
import { AppComponent } from './app.component';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { ThemeModule } from './modules/theme.module';

// commun
import { SharedModule } from './shared/shared.module';

// Confi
import { LayoutConfig } from './core/layout/_config/layout.config';

// ngx-ui-loader
import { NgxUiLoaderModule, POSITION, SPINNER, PB_DIRECTION, NgxUiLoaderConfig } from 'ngx-ui-loader';
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    fgsColor: '#FFC527',
    bgsPosition: POSITION.bottomCenter,
    bgsType: SPINNER.squareLoader,
    fgsType: SPINNER.squareLoader,
    pbDirection: PB_DIRECTION.leftToRight,
    pbThickness: 3,
    hasProgressBar: true,
    pbColor: '#FFC527',
};

// Highlight JS
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { LayoutConfigService } from './core/layout';

// translate
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { InterceptService } from './core';

// Local
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
registerLocaleData(localeFr);

// calcualtion
import { CalculationToken } from './core/helpers/calculation/icalculation';
import { Calculation } from './core/helpers/calculation/calculation';

// guard
import { AuthGuard } from './core/guards/auth-guard.service';

// pipes
import { PipesModule } from './pipes/pipes.module';

// data tables translate
import { CustomMatPaginatorIntl } from './core/intl/custom-mat-paginator-intl';

// tslint:disable-next-line:class-name
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    wheelSpeed: 0.5,
    swipeEasing: true,
    minScrollbarLength: 40,
    maxScrollbarLength: 300,
};

export function initializeLayoutConfig(appConfig: LayoutConfigService) {
    // initialize app by loading default demo layout config
    return () => {
        if (appConfig.getConfig() === null) {
            appConfig.loadConfigs(new LayoutConfig().configs);
        }
    };
}

export function hljsLanguages() {
    return {
        typescript: () => import('highlight.js/lib/languages/typescript'),
        json: () => import('highlight.js/lib/languages/json'),
        scss: () => import('highlight.js/lib/languages/scss'),
        css: () => import('highlight.js/lib/languages/css'),
        xml: () => import('highlight.js/lib/languages/xml')
    };
}

export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/menu/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        SharedModule,
        CoreModule,
        OverlayModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        InlineSVGModule.forRoot(),
        ThemeModule,
        PipesModule,
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        PerfectScrollbarModule
    ],
    exports: [],
    providers: [
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        {
            provide: HAMMER_GESTURE_CONFIG,
            useClass: GestureConfig
        },
        {
            // layout config initializer
            provide: APP_INITIALIZER,
            useFactory: initializeLayoutConfig,
            deps: [LayoutConfigService], multi: true
        },
        {
            provide: HIGHLIGHT_OPTIONS,
            useValue: { languages: hljsLanguages }
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InterceptService,
            multi: true
        },
        {
            provide: LOCALE_ID,
            useValue: 'fr-FR'
        },
        {
            provide: CalculationToken,
            useClass: Calculation
        },
        {
            provide: MatPaginatorIntl,
            useFactory: (translate: TranslateService) => {
                const service = new CustomMatPaginatorIntl();
                service.injectTranslateService(translate);
                return service;
            },
            deps: [TranslateService]
        },
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
