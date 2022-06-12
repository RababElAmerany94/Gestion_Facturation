import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SharedModule } from './../../shared/shared.module';
import { AgendaCommercialRoutingModule } from './agenda-commercial-routing.module';
import { AgendaCommercialStatusComponent } from './components/agenda-commercial-status/agenda-commercial-status.component';
import { AgendaComponent } from './components/agenda/agenda.component';
import { AgendaCommercialEditComponent } from './components/edit/edit.component';
import { AgendaCommercialIndexComponent } from './components/index/index.component';
import { AgendaCommercialShowComponent } from './components/show/show.component';
import { AgendaCommercialTabsComponent } from './components/tabs/tabs.component';
import { AgendaCommercialShellComponent } from './containers/agenda-commercial-shell/agenda-commercial-shell.component';
import { FilterAgendaComercialComponent } from './components/filter-agenda-comercial/filter-agenda-comercial.component';
import { ContextMenuModule } from 'ngx-contextmenu';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/agenda-commercial/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        AgendaComponent,
        AgendaCommercialShellComponent,
        AgendaCommercialTabsComponent,
        AgendaCommercialIndexComponent,
        AgendaCommercialEditComponent,
        AgendaCommercialShowComponent,
        AgendaCommercialStatusComponent,
        FilterAgendaComercialComponent,
    ],
    imports: [
        AgendaCommercialRoutingModule,
        SharedModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            isolate: true
        }),
        ContextMenuModule.forRoot({ useBootstrap4: true }),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        })
    ],
    exports: [
        AgendaCommercialShellComponent
    ]
})
export class AgendaCommercialModule { }
