// Angular
import { Component, ElementRef, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
// Layout
import { LayoutConfigService, TranslationService } from 'app/core/layout';
import { TranslateService } from '@ngx-translate/core';
import { LoaderService } from 'app/core/services/loader.service';

@Component({
    selector: 'kt-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {
    // Public properties
    today: number = Date.now();
    headerLogo: string;

    /**
     * Component constructor
     *
     * @param el:el
     * @param render:render
     * @param layoutConfigService: LayoutConfigService
     * @param authNoticeService: authNoticeService
     * @param translationService: TranslationService
     * @param loaderService: LoaderService
     */
    constructor(
        private translate: TranslateService,
        private el: ElementRef,
        private render: Renderer2,
        private layoutConfigService: LayoutConfigService,
        private translationService: TranslationService,
        private loaderService: LoaderService) {
    }

    /**
     * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
     */

    /**
     * On init
     */
    ngOnInit(): void {
        this.translationService.setLanguage(this.translate);
        this.headerLogo = this.layoutConfigService.getLogo();
        this.loaderService.hide();
    }

    /**
     * Load CSS for this specific page only, and destroy when navigate away
     * @param styleUrl
     */
    private loadCSS(styleUrl: string) {
        return new Promise((resolve, reject) => {
            const styleElement = document.createElement('link');
            styleElement.href = styleUrl;
            styleElement.type = 'text/css';
            styleElement.rel = 'stylesheet';
            styleElement.onload = resolve;
            this.render.appendChild(this.el.nativeElement, styleElement);
        });
    }
}
