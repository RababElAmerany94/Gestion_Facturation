// Angular
import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
// Object-Path
import * as objectPath from 'object-path';
// Layout
import { LayoutConfigService, SplashScreenService } from '../../core/layout';
import { LoaderService } from 'app/core/services/loader.service';
import { SubSink } from 'subsink';
import { ILoaderPercent } from 'app/core/models/general/loader-percent';

@Component({
    selector: 'kt-splash-screen',
    templateUrl: './splash-screen.component.html',
    styleUrls: ['./splash-screen.component.scss']
})
export class SplashScreenComponent implements OnInit {

    subs = new SubSink();

    // Public proprties
    loaderLogo: string;
    loaderType: string;
    loaderMessage: string;

    @ViewChild('splashScreen', { static: true }) splashScreen: ElementRef;

    constructor(
        private cdRef: ChangeDetectorRef,
        private layoutConfigService: LayoutConfigService,
        private splashScreenService: SplashScreenService,
        private loaderService: LoaderService) {
        this.subscribeLoader();
    }

    /**
     * subscribe loader changes
     */
    subscribeLoader() {
        this.subs.sink = this.loaderService.loaderState.subscribe((state: ILoaderPercent) => {
            this.loaderMessage = state.message;
            if (state.show) {
                this.splashScreenService.show();
            } else {
                this.splashScreenService.hide();
            }
            this.cdRef.detectChanges();
        });
    }


    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit() {
        // init splash screen, see loader option in layout.config.ts
        const loaderConfig = this.layoutConfigService.getConfig('loader');
        this.loaderLogo = objectPath.get(loaderConfig, 'logo');
        this.loaderType = objectPath.get(loaderConfig, 'type');
        this.loaderMessage = objectPath.get(loaderConfig, 'message');

        this.splashScreenService.init(this.splashScreen);
    }
}
