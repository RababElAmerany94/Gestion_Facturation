import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingTableComponent } from './components/accounting-table/accounting-table.component';
import { IndexAccountingComponent } from './components/index/index.component';
import { AccountingShellComponent } from './container/accounting-shell/accounting-shell.component';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/accounting/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}
@NgModule({
    declarations: [
        AccountingShellComponent,
        IndexAccountingComponent,
        AccountingTableComponent
    ],
    imports: [
        SharedModule,
        AccountingRoutingModule,
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
export class AccountingModule { }
