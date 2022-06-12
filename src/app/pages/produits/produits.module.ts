import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'app/shared/shared.module';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { BaseEditComponent } from './components/base-edit/base-edit.component';
import { DetailComponent } from './components/detail/detail.component';
import { EditAgenceComponent } from './components/edit-agence/edit-agence.component';
import { EditComponent } from './components/edit/edit.component';
import { IndexComponent } from './components/index/index.component';
import { ProduitsShellComponent } from './containers/produits-shell/produits-shell.component';
import { ProduitsRoutingModule } from './produits-routing.module';

// Translation
export function HttpLoaderFactory(http: HttpClient) {
    return new MultiTranslateHttpLoader(http, [
        { prefix: './assets/i18n/produits/', suffix: '.json' },
        { prefix: './assets/i18n/errors/', suffix: '.json' },
        { prefix: './assets/i18n/shared/', suffix: '.json' },
    ]);
}

@NgModule({
    declarations: [
        ProduitsShellComponent,
        IndexComponent,
        EditComponent,
        DetailComponent,
        EditAgenceComponent,
        BaseEditComponent
    ],
    imports: [
        SharedModule,
        ProduitsRoutingModule,
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
export class ProduitsModule { }
