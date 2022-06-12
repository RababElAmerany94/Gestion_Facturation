// Angular
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { StringHelper } from './core/helpers/string';
// Layout
import { LayoutConfigService, TranslationService } from './core/layout';
import { ToastService } from './core/layout/services/toast.service';
import { GlobalErrorService } from './core/services/global-error.service';
import { LoaderService } from './core/services/loader.service';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'body[kt-root]',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {

    subs = new SubSink();
    loader: boolean;

    /**
     * Component constructor
     *
     * @param translationService: TranslationService
     * @param router: Router
     * @param layoutConfigService: LayoutCongifService
     */
    constructor(
        private router: Router,
        private layoutConfigService: LayoutConfigService,
        private toastService: ToastService,
        private globalErrorService: GlobalErrorService,
        private translate: TranslateService,
        private translateService: TranslationService,
        private loaderService: LoaderService) {
        this.translateService.setLanguage(this.translate);
        this.subscribeErrorGlobal();
        setTimeout(() => {
            this.loaderService.hide();
        }, 500);
    }

    /**
     * show global errors
     */
    subscribeErrorGlobal() {
        this.subs.sink = this.globalErrorService
            .messagesState
            .pipe(debounceTime(500))
            .subscribe((result: string) => {
                if (!StringHelper.isEmptyOrNull(result)) {
                    this.toastService.error(this.translate.instant(result));
                }
            });
    }


    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
        // enable/disable loader
        this.loader = this.layoutConfigService.getConfig('loader.enabled');

        const routerSubscription = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                // hide splash screen
                this.loaderService.hide();

                // scroll to top on every route change
                window.scrollTo(0, 0);

                // to display back the body content
                setTimeout(() => {
                    document.body.classList.add('kt-page--loaded');
                }, 500);
            }
        });
        this.subs.sink = routerSubscription;
    }

    /**
     * On Destroy
     */
    ngOnDestroy() {
        this.subs.unsubscribe();
    }
}
